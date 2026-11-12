type CharClass = 'D' | 'L';

interface GeneratorOptions {
  /** Алфавит для букв. По умолчанию A-Z */
  letters?: string;
  /** Алфавит для цифр. По умолчанию 0-9 */
  digits?: string;
}

const DEFAULT_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_DIGITS = '0123456789';

/** Равномерный случайный индекс [0, max) без modulo bias */
function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function pick(alphabet: string): string {
  return alphabet[randomIndex(alphabet.length)];
}

/** "97Q172BR25DB1B" -> ["D","D","L","D","D","D","L","L",...] */
export function parseMask(reference: string): CharClass[] {
  return [...reference].map((ch) => {
    if (/\d/.test(ch)) return 'D';
    if (/[A-Za-z]/.test(ch)) return 'L';
    throw new Error(`Неподдерживаемый символ в референсе: "${ch}"`);
  });
}

export function createCodeGenerator(
  reference: string,
  { letters = DEFAULT_LETTERS, digits = DEFAULT_DIGITS }: GeneratorOptions = {},
) {
  const mask = parseMask(reference);

  const generate = (): string => mask.map((c) => pick(c === 'D' ? digits : letters)).join('');

  const validate = (code: string): boolean =>
    code.length === mask.length &&
    [...code].every((ch, i) => (mask[i] === 'D' ? digits.includes(ch) : letters.includes(ch)));

  const generateUnique = (count: number, exclude: Set<string> = new Set()) => {
    const result = new Set<string>();
    const space = mask.reduce((acc, c) => acc * (c === 'D' ? digits.length : letters.length), 1);
    if (count + exclude.size > space) {
      throw new Error('Запрошено больше кодов, чем позволяет формат');
    }
    while (result.size < count) {
      const code = generate();
      if (!exclude.has(code)) result.add(code);
    }
    return [...result];
  };

  return { generate, validate, generateUnique };
}

const gen = createCodeGenerator('97Q172BR25DB1B');
console.log(gen.generate()); // например "41K908XT63MZ7C"
console.log(gen.generateUnique(3));
console.log(gen.validate('97Q172BR25DB1B')); // true
