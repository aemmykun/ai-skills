import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { loadRegistry } from '../adapter/registry.js';
import { invoke, readBounded, MAX_BYTES } from '../adapter/invoke.js';
import { createServer } from '../adapter/server.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const registry = await loadRegistry(root);
const token = 'synthetic-test-token-32-characters-only';

test('all existing skill packages and executable examples are discoverable', () => {
  assert.equal(registry.size, 11);
  for (const id of ['create-skill', 'housekeeping-agent-skill-v1', 'universal-adaptor-second-thought', 'text-statistics', 'json-format', 'http-json']) assert.ok(registry.has(id));
});

test('instruction mode supplies guidance and input without claiming execution', async () => {
  const result = await invoke(registry, 'housekeeping-agent-skill-v1', { task: 'Review a synthetic cleaning plan' });
  assert.equal(result.status, 'instructions_ready');
  assert.match(result.output.instructions, /housekeeping/i);
  assert.equal(result.output.input.task, 'Review a synthetic cleaning plan');
});

test('module examples work independently with meaningful edge cases', async () => {
  assert.deepEqual((await invoke(registry, 'text-statistics', { text: 'A 😀\r\nB' })).output, { characters: 6, words: 3, lines: 2 });
  assert.deepEqual((await invoke(registry, 'text-statistics', { text: '' })).output, { characters: 0, words: 0, lines: 0 });
  assert.deepEqual((await invoke(registry, 'json-format', { value: { a: 1 }, indent: 0 })).output, { formatted: '{"a":1}' });
});

test('unknown skills and invalid inputs fail before execution', async () => {
  await assert.rejects(invoke(registry, '../anything', {}), { code: 'SKILL_NOT_FOUND' });
  for (const input of [{ text: 1 }, { text: 'hello', executable: 'anything' }, null]) {
    await assert.rejects(invoke(registry, 'text-statistics', input), { code: 'INVALID_INPUT' });
  }
});

test('HTTP skill fails closed without configuration or with unsafe transport', async () => {
  await assert.rejects(invoke(registry, 'http-json', { message: 'test' }, { env: {} }), { code: 'SKILL_NOT_CONFIGURED' });
  for (const endpoint of ['http://example.test', 'https://name:secret@example.test', 'not-a-url']) {
    await assert.rejects(invoke(registry, 'http-json', { message: 'test' }, { env: { HTTP_JSON_ENDPOINT: endpoint, HTTP_JSON_TOKEN: 'synthetic' } }), { code: 'SKILL_NOT_CONFIGURED' });
  }
});

test('HTTP connector sends validated JSON and operator credential; rejects redirects/errors and invalid output', async (t) => {
  const env = { HTTP_JSON_ENDPOINT: 'https://example.test/skill', HTTP_JSON_TOKEN: 'synthetic-upstream' };
  const mocked = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url.href, env.HTTP_JSON_ENDPOINT);
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.authorization, 'Bearer synthetic-upstream');
    assert.equal(options.body, '{"message":"hello"}');
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(JSON.stringify({ reply: 'received' }));
  });
  assert.equal((await invoke(registry, 'http-json', { message: 'hello' }, { env })).output.reply, 'received');
  mocked.mock.mockImplementation(async () => new Response('{"unexpected":1}'));
  await assert.rejects(invoke(registry, 'http-json', { message: 'hello' }, { env }), { code: 'INVALID_OUTPUT' });
  mocked.mock.mockImplementation(async () => new Response('upstream-secret', { status: 503 }));
  await assert.rejects(invoke(registry, 'http-json', { message: 'hello' }, { env }), (error) => error.code === 'UPSTREAM_ERROR' && !error.message.includes('secret'));
  mocked.mock.mockImplementation(async () => { throw new Error('redirect or network failure with upstream-secret'); });
  await assert.rejects(invoke(registry, 'http-json', { message: 'hello' }, { env }), { code: 'UPSTREAM_ERROR' });
  mocked.mock.mockImplementation(async () => new Response('not-json'));
  await assert.rejects(invoke(registry, 'http-json', { message: 'hello' }, { env }), { code: 'UPSTREAM_ERROR' });
});

test('bounded reads reject oversized streamed data', async () => {
  async function* chunks() { yield Buffer.alloc(MAX_BYTES); yield Buffer.from('x'); }
  await assert.rejects(readBounded(chunks()), { code: 'PAYLOAD_TOO_LARGE' });
});

test('HTTP deadline aborts a pending request and oversize upstream bodies are rejected', async (t) => {
  const local = new Map(registry);
  const original = registry.get('http-json');
  local.set('http-json', { ...original, manifest: { ...original.manifest, http: { ...original.manifest.http, timeoutMs: 10 } } });
  const env = { HTTP_JSON_ENDPOINT: 'https://example.test/skill', HTTP_JSON_TOKEN: 'synthetic' };
  const mocked = t.mock.method(globalThis, 'fetch', (_url, { signal }) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(new Response('{"reply":"too late"}')), 1000);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
  }));
  await assert.rejects(invoke(local, 'http-json', { message: 'test' }, { env }), { code: 'UPSTREAM_ERROR' });
  mocked.mock.mockImplementation(async () => new Response('x'.repeat(MAX_BYTES + 1)));
  await assert.rejects(invoke(local, 'http-json', { message: 'test' }, { env }), { code: 'PAYLOAD_TOO_LARGE' });
});

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'ai-skills-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, 'one'));
  await writeFile(path.join(directory, 'one/SKILL.md'), 'fixture instructions');
  const manifest = JSON.parse(await readFile(path.join(root, 'skills/text-statistics/manifest.json'), 'utf8'));
  manifest.handler = 'handler.mjs';
  await writeFile(path.join(directory, 'skills.json'), JSON.stringify({ version: 1, skills: ['one/manifest.json'] }));
  await writeFile(path.join(directory, 'one/handler.mjs'), 'export function run() { return { wrong: true }; }');
  await writeFile(path.join(directory, 'one/manifest.json'), JSON.stringify(manifest));
  return { directory, manifest, save: () => writeFile(path.join(directory, 'one/manifest.json'), JSON.stringify(manifest)) };
}

test('bad module outputs and duplicate registration are rejected', async (t) => {
  const { directory } = await fixture(t);
  await assert.rejects(invoke(await loadRegistry(directory), 'text-statistics', { text: 'test' }), { code: 'INVALID_OUTPUT' });
  await writeFile(path.join(directory, 'skills.json'), JSON.stringify({ version: 1, skills: ['one/manifest.json', 'one/manifest.json'] }));
  await assert.rejects(loadRegistry(directory), /Duplicate/);
});

test('manifest schema and path traversal cannot load a handler outside its skill', async (t) => {
  const f = await fixture(t);
  f.manifest.unknown = true; await f.save();
  await assert.rejects(loadRegistry(f.directory), /Invalid skill manifest/);
  delete f.manifest.unknown;
  await writeFile(path.join(f.directory, 'outside.mjs'), 'throw new Error("must not run")');
  f.manifest.handler = '../outside.mjs'; await f.save();
  await assert.rejects(loadRegistry(f.directory), /within its skill directory/);
});

test('directory links cannot escape the registry root', async (t) => {
  const f = await fixture(t);
  const outside = await mkdtemp(path.join(tmpdir(), 'ai-skills-outside-'));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await writeFile(path.join(outside, 'manifest.json'), '{}');
  await symlink(outside, path.join(f.directory, 'linked'), 'junction');
  await writeFile(path.join(f.directory, 'skills.json'), JSON.stringify({ version: 1, skills: ['linked/manifest.json'] }));
  await assert.rejects(loadRegistry(f.directory), /within its skill directory/);
});

test('real loopback API authenticates, discovers and invokes skills; reports client errors', async (t) => {
  const server = await createServer({ root, token, env: {} });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const url = `http://127.0.0.1:${server.address().port}`;
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  assert.equal((await fetch(url + '/v1/skills')).status, 401);
  assert.equal((await fetch(url + '/v1/skills', { headers: { ...headers, origin: 'https://example.test' } })).status, 403);
  const list = await (await fetch(url + '/v1/skills', { headers })).json();
  assert.equal(list.skills.length, 11);
  assert.equal((await fetch(url + '/v1/skills/json-format', { headers })).status, 200);
  const call = (id, body) => fetch(url + '/v1/skills/' + id + '/invoke', { method: 'POST', headers, body });
  const result = await (await call('text-statistics', '{"text":"one two"}')).json();
  assert.equal(result.output.words, 2);
  assert.equal((await call('text-statistics', '{}')).status, 422);
  assert.equal((await call('text-statistics', '{')).status, 400);
  assert.equal((await call('missing', '{}')).status, 404);
  assert.equal((await call('http-json', '{"message":"hello"}')).status, 503);
  assert.equal((await call('text-statistics', JSON.stringify({ text: 'x'.repeat(MAX_BYTES) }))).status, 413);
  const streamedStatus = await new Promise((resolve, reject) => {
    const request = http.request(url + '/v1/skills/text-statistics/invoke', { method: 'POST', headers }, response => {
      response.resume(); resolve(response.statusCode);
    });
    request.on('error', reject);
    request.write('x'.repeat(MAX_BYTES)); request.end('x');
  });
  assert.equal(streamedStatus, 413);
  assert.equal((await fetch(url + '/v1/skills/text-statistics/invoke', { method: 'POST', headers: { authorization: headers.authorization }, body: '{}' })).status, 415);
});

test('server refuses startup without a sufficiently long adapter credential', async () => {
  await assert.rejects(createServer({ root, token: '' }), /at least 32/);
});
