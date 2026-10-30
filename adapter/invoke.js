import { pathToFileURL } from 'node:url';
import { SkillError } from './errors.js';
import { getSkill } from './registry.js';

export const MAX_BYTES = 1024 * 1024;

export async function readBounded(stream) {
  const chunks = []; let size = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BYTES) throw new SkillError('PAYLOAD_TOO_LARGE', 'Payload exceeds 1 MiB.', 413);
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function callHttp(config, input, env) {
  const endpoint = env[config.endpointEnv];
  const token = env[config.tokenEnv];
  if (!endpoint || !token) throw new SkillError('SKILL_NOT_CONFIGURED', 'API endpoint and credential must be configured.', 503);
  let url;
  try { url = new URL(endpoint); } catch { throw new SkillError('SKILL_NOT_CONFIGURED', 'Invalid API endpoint configuration.', 503); }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
    throw new SkillError('SKILL_NOT_CONFIGURED', 'API endpoint must use HTTPS without embedded credentials or a fragment.', 503);
  }
  try {
    const response = await fetch(url, {
      method: 'POST', redirect: 'error',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(input), signal: AbortSignal.timeout(config.timeoutMs)
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new SkillError('UPSTREAM_ERROR', 'Skill API returned an unsuccessful response.', 502);
    }
    return JSON.parse(await readBounded(response.body));
  } catch (error) {
    if (error instanceof SkillError) throw error;
    throw new SkillError('UPSTREAM_ERROR', 'Skill API request failed or returned invalid JSON.', 502);
  }
}

export async function invoke(registry, id, input, { env = process.env } = {}) {
  const skill = getSkill(registry, id);
  if (!skill.validateInput(input)) throw new SkillError('INVALID_INPUT', 'Input does not match the skill input schema.', 422);
  let output;
  if (skill.manifest.mode === 'instructions') {
    output = { instructions: skill.instructions, input };
  } else if (skill.manifest.mode === 'module') {
    const module = await import(pathToFileURL(skill.handler).href);
    if (typeof module.run !== 'function') throw new SkillError('INVALID_HANDLER', 'Skill handler must export run(input).', 500);
    // Registry modules are trusted operator-installed code, not a sandbox.
    output = await module.run(input);
  } else {
    output = await callHttp(skill.manifest.http, input, env);
  }
  if (!skill.validateOutput(output)) throw new SkillError('INVALID_OUTPUT', 'Skill output does not match its output schema.', 502);
  const envelope = {
    skill: id, version: skill.manifest.version, mode: skill.manifest.mode,
    status: skill.manifest.mode === 'instructions' ? 'instructions_ready' : 'completed', output
  };
  if (Buffer.byteLength(JSON.stringify(envelope)) > MAX_BYTES) throw new SkillError('PAYLOAD_TOO_LARGE', 'Skill output exceeds 1 MiB.', 413);
  return envelope;
}
