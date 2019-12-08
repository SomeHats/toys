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

export function mapRange(
  a1: number,
  b1: number,
  a2: number,
  b2: number,
  n: number
): number {
  return lerp(a2, b2, invLerp(a1, b1, n));
}

export function rand(a: number, b?: number) {
  if (typeof b === "number") {
    return lerp(a, b, Math.random());
  }
  return lerp(0, a, Math.random());
}

export function sample<T>(arr: ReadonlyArray<T>): T {
  return arr[Math.floor(rand(arr.length))];
}

export function randomColor(): string {
  return `rgb(${Math.floor(rand(256))},${Math.floor(rand(256))},${Math.floor(
    rand(256)
  )})`;
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
  entries: ReadonlyArray<[K, V]>
): Record<K, V> {
  const result = {} as Record<K, V>;
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export function compact<T>(arr: ReadonlyArray<T>): Array<NonNullable<T>> {
  return arr.filter(
    (item): item is NonNullable<T> => item !== null && item !== undefined
  );
}
