export function run({ value, indent = 2 }) {
  return { formatted: JSON.stringify(value, null, indent) };
}
