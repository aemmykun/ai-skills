import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import { SkillError } from './errors.js';

const ajv = new Ajv({ allErrors: true, strict: true });
const envName = { type: 'string', pattern: '^[A-Z][A-Z0-9_]*$' };
const manifestSchema = {
  type: 'object', additionalProperties: false,
  required: ['id', 'version', 'description', 'mode', 'instructions', 'inputSchema', 'outputSchema'],
  properties: {
    id: { type: 'string', pattern: '^[a-z][a-z0-9-]{0,63}$' },
    version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
    description: { type: 'string', minLength: 1 },
    mode: { enum: ['instructions', 'module', 'http'] },
    instructions: { type: 'string', minLength: 1 },
    handler: { type: 'string', minLength: 1 },
    inputSchema: { type: 'object' }, outputSchema: { type: 'object' },
    http: {
      type: 'object', additionalProperties: false,
      required: ['endpointEnv', 'tokenEnv', 'timeoutMs'],
      properties: {
        endpointEnv: envName, tokenEnv: envName,
        timeoutMs: { type: 'integer', minimum: 1, maximum: 60000 }
      }
    }
  }
};
const validateManifest = ajv.compile(manifestSchema);

export async function containedFile(root, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error('Expected relative file path');
  const base = await realpath(root);
  const file = await realpath(path.resolve(base, relative));
  const rel = path.relative(base, file);
  if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) {
    throw new Error('File must stay within its skill directory');
  }
  return file;
}

export async function loadRegistry(root) {
  root = await realpath(root);
  const registry = JSON.parse(await readFile(path.join(root, 'skills.json'), 'utf8'));
  if (registry.version !== 1 || !Array.isArray(registry.skills) || registry.skills.length === 0) {
    throw new Error('Invalid skills.json');
  }
  const skills = new Map();
  for (const relative of registry.skills) {
    const manifestPath = await containedFile(root, relative);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (!validateManifest(manifest)) throw new Error(`Invalid skill manifest: ${relative}`);
    if (skills.has(manifest.id)) throw new Error(`Duplicate skill ID: ${manifest.id}`);
    if ((manifest.mode === 'module') !== Boolean(manifest.handler) ||
        (manifest.mode === 'http') !== Boolean(manifest.http)) throw new Error(`Mode/config mismatch: ${manifest.id}`);
    const directory = path.dirname(manifestPath);
    const instructions = await readFile(await containedFile(directory, manifest.instructions), 'utf8');
    const handler = manifest.handler ? await containedFile(directory, manifest.handler) : null;
    skills.set(manifest.id, {
      manifest, instructions, handler,
      validateInput: ajv.compile(manifest.inputSchema),
      validateOutput: ajv.compile(manifest.outputSchema)
    });
  }
  return skills;
}

export function getSkill(registry, id) {
  const skill = registry.get(id);
  if (!skill) throw new SkillError('SKILL_NOT_FOUND', 'Unknown skill.', 404);
  return skill;
}

export function describe(skill) {
  const { id, version, description, mode, inputSchema, outputSchema } = skill.manifest;
  return { id, version, description, mode, inputSchema, outputSchema };
}
