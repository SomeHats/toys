export function times<T>(n: number, fn: (idx: number) => T): Array<T> {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
}

export function lerp(a: number, b: number, n: number): number {
  return (b - a) * n + a;
}

export function invLerp(a: number, b: number, n: number): number {
  return (n - a) / (b - a);
}

export function constrain(min: number, max: number, n: number): number {
  return Math.min(max, Math.max(min, n));
}

export function constrainWrapped(min: number, max: number, n: number): number {
  const size = max - min;
  n = n - min;
  while (n < 0) {
    n += size;
  }
  n = n % size;
  return min + n;
}

export function mapRange(
  a1: number,
  b1: number,
  a2: number,
  b2: number,
  n: number,
): number {
  return lerp(a2, b2, invLerp(a1, b1, n));
}

export function random(a: number, b?: number) {
  if (typeof b === 'number') {
    return lerp(a, b, Math.random());
  }
  return lerp(0, a, Math.random());
}

export function randomInt(a: number, b?: number) {
  return Math.floor(random(a, b));
}

export function varyAbsolute(base: number, amount: number): number {
  return random(base - amount, base + amount);
}

export function varyRelative(base: number, amount: number): number {
  return varyAbsolute(base, base * amount);
}

export function sample<T>(arr: ReadonlyArray<T>): T {
  return arr[Math.floor(random(arr.length))];
}

export function flatten<T>(arr: ReadonlyArray<ReadonlyArray<T>>): Array<T> {
  return arr.reduce<Array<T>>((a, b) => a.concat(b), []);
}

export function uniq<T>(arr: T[]): Array<T> {
  return Array.from(new Set(arr));
}

export function intersection<T>(a1: T[], a2: T[]): T[] {
  const a1Items = new Set(a1);
  const result = new Set<T>();
  for (const item of a2) {
    if (a1Items.has(item)) {
      result.add(item);
    }
  }
  return Array.from(result);
}

export function randomColor(): string {
  return `rgb(${Math.floor(random(256))},${Math.floor(
    random(256),
  )},${Math.floor(random(256))})`;
}

export function removeFromArray<T>(array: Array<T>, item: T) {
  const idx = array.indexOf(item);
  if (idx !== -1) {
    array.splice(idx, 1);
  }
}

export function frame(): Promise<void> {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => resolve());
  });
}

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export async function frameLoop(cb: () => void) {
  while (true) {
    await frame();
    cb();
  }
}

export function fromEntries<K extends PropertyKey, V>(
  entries: ReadonlyArray<[K, V]>,
): Record<K, V> {
  const result = {} as Record<K, V>;
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export function compact<T>(arr: ReadonlyArray<T>): Array<NonNullable<T>> {
  return arr.filter(
    (item): item is NonNullable<T> => item !== null && item !== undefined,
  );
}

export function normalizeAngle(angle: number): number {
  return constrainWrapped(-Math.PI, Math.PI, angle);
}

export function clamp(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, n));
}

export function shuffle<T>(arr: ReadonlyArray<T>): Array<T> {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function getId(prefix = ''): string {
  return `${prefix}${Math.random()
    .toString(36)
    .slice(1)}`;
}
