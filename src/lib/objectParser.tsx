import { Result } from './Result';
import { entries, get, has, keys } from './utils';

class ParserError {
  constructor(
    public readonly message: string,
    public readonly path: ReadonlyArray<number | string>,
  ) {}

  formatPath() {
    let path = 'ROOT';
    for (const item of path) {
      if (typeof item === 'number') {
        path += `[${item}]`;
      } else {
        path += `.${item}`;
      }
    }
    return path;
  }

  toString() {
    return `At ${this.formatPath()}: ${this.message}`;
  }
}

export type Parser<T> = (input: unknown) => Result<T, ParserError>;
export type ParserType<T extends Parser<any>> = T extends Parser<infer U>
  ? U
  : never;

function createTypeofParser<T>(type: string): Parser<T> {
  return (input: unknown) => {
    if (typeof input === type) {
      return Result.ok(input as T);
    }
    return Result.error(
      new ParserError(`Expected ${type}, got ${typeof input}`, []),
    );
  };
}

function prefixError(error: ParserError, within: string | number): ParserError {
  return new ParserError(error.message, [within, ...error.path]);
}

export const parseString = createTypeofParser<string>('string');
export const parseNumber = createTypeofParser<number>('number');
export const parseBoolean = createTypeofParser<boolean>('boolean');

export function createArrayParser<T>(parseItem: Parser<T>): Parser<Array<T>> {
  return (input: unknown) => {
    if (!Array.isArray(input)) {
      return Result.error(
        new ParserError(`Expected Array, got ${typeof input}`, []),
      );
    }

    return Result.collect(
      input.map((rawItem, i) =>
        parseItem(rawItem).mapErr((err) => prefixError(err, i)),
      ),
    );
  };
}

export function createShapeParser<T extends Record<string, any>>(
  parserMap: { [K in keyof T]: Parser<T[K]> },
): Parser<T> {
  return (input: unknown) => {
    if (!(typeof input === 'object')) {
      return Result.error(
        new ParserError(`Expected object, got ${typeof input}`, []),
      );
    }
    if (input === null) {
      return Result.error(new ParserError('Expected object, got null', []));
    }

    return Result.collect(
      entries(parserMap).map(([key, parseValue]) =>
        parseValue(get(input, key))
          .map((value) => [key, value])
          .mapErr((err) => prefixError(err, key)),
      ),
    ).map((parsedEntries) => Object.fromEntries(parsedEntries));
  };
}
