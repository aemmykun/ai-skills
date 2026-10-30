export function run({ text }) {
  return { characters: [...text].length, words: text.trim() ? text.trim().split(/\s+/u).length : 0, lines: text ? text.split(/\r\n|\r|\n/u).length : 0 };
}
