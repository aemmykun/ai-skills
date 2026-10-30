import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { loadRegistry, describe, getSkill } from './registry.js';
import { invoke } from './invoke.js';
import { publicError } from './errors.js';

try {
  const registry = await loadRegistry(fileURLToPath(new URL('../', import.meta.url)));
  const [command = 'list', id, inputFile] = process.argv.slice(2);
  let result;
  if (command === 'list') result = [...registry.values()].map(describe);
  else if (command === 'validate') result = { valid: true, skills: registry.size };
  else if (command === 'describe') result = describe(getSkill(registry, id));
  else if (command === 'invoke' && inputFile) result = await invoke(registry, id, JSON.parse(await readFile(inputFile, 'utf8')));
  else throw new Error('Usage: list | validate | describe ID | invoke ID input.json');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: publicError(error) }));
  process.exitCode = 1;
}
