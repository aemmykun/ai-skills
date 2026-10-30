import http from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistry, describe, getSkill } from './registry.js';
import { invoke, readBounded, MAX_BYTES } from './invoke.js';
import { SkillError, publicError } from './errors.js';

export async function createServer({ root, token, env = process.env }) {
  if (typeof token !== 'string' || token.length < 32) throw new Error('SKILLS_ADAPTER_TOKEN must contain at least 32 characters');
  const registry = await loadRegistry(root);
  const expected = Buffer.from(`Bearer ${token}`);
  return http.createServer({ requestTimeout: 15000, headersTimeout: 10000 }, async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      res.end(JSON.stringify(body));
    };
    try {
      const supplied = Buffer.from(req.headers.authorization ?? '');
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) throw new SkillError('UNAUTHORIZED', 'A valid adapter token is required.', 401);
      if (req.headers.origin) throw new SkillError('ORIGIN_NOT_ALLOWED', 'Browser-origin requests are not supported.', 403);
      const url = new URL(req.url, 'http://127.0.0.1');
      if (req.method === 'GET' && url.pathname === '/health') return send(200, { status: 'ok' });
      if (req.method === 'GET' && url.pathname === '/v1/skills') return send(200, { skills: [...registry.values()].map(describe) });
      const match = /^\/v1\/skills\/([a-z][a-z0-9-]{0,63})(\/invoke)?$/.exec(url.pathname);
      if (!match) throw new SkillError('NOT_FOUND', 'Unknown endpoint.', 404);
      const skill = getSkill(registry, match[1]);
      if (req.method === 'GET' && !match[2]) return send(200, describe(skill));
      if (req.method !== 'POST' || !match[2]) throw new SkillError('METHOD_NOT_ALLOWED', 'Unsupported method.', 405);
      if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') throw new SkillError('UNSUPPORTED_MEDIA_TYPE', 'Use application/json.', 415);
      if (Number(req.headers['content-length']) > MAX_BYTES) throw new SkillError('PAYLOAD_TOO_LARGE', 'Payload exceeds 1 MiB.', 413);
      let input;
      try { input = JSON.parse(await readBounded(req.iterator({ destroyOnReturn: false }))); }
      catch (error) { if (error instanceof SkillError) throw error; throw new SkillError('INVALID_JSON', 'Request body must be valid JSON.'); }
      return send(200, await invoke(registry, match[1], input, { env }));
    } catch (error) {
      // Close rejected request connections without consuming an unbounded body.
      res.setHeader('connection', 'close');
      if (!res.destroyed) send(error instanceof SkillError ? error.status : 500, { error: publicError(error) });
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const server = await createServer({ root, token: process.env.SKILLS_ADAPTER_TOKEN });
    const port = Number(process.env.PORT ?? 8787);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
    server.on('error', () => { console.error('Adapter could not listen on the configured port.'); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => console.error(`Skills adapter listening at http://127.0.0.1:${port}`));
    for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
  } catch { console.error('Adapter startup failed. Check registry, PORT, and SKILLS_ADAPTER_TOKEN configuration.'); process.exitCode = 1; }
}
