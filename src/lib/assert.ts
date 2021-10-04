export function fail(message: string): never {
  throw new Error(message);
}

export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    fail(message || 'Assertion Error');
  }
}
