import { fail } from "@/lib/assert";

export type Result<T, E> = OkResult<T, E> | ErrorResult<T, E>;
export const Result = {
    ok<T>(value: T): OkResult<T, never> {
        return new OkResult(value);
    },
    error<E>(error: E): ErrorResult<never, E> {
        return new ErrorResult(error);
    },
    collect<T, E>(results: Array<Result<T, E>>): Result<Array<T>, E> {
        const arr: Array<T> = [];
        for (const result of results) {
            if (result.isOk()) {
                arr.push(result.value);
            } else {
                // @ts-expect-error error type matches
                return result;
            }
        }
        return Result.ok(arr);
    },
};

export abstract class AbstractResult<T, E> {
    constructor() {}

    abstract isOk(): this is OkResult<T, E>;
    abstract isError(): this is ErrorResult<T, E>;
    abstract unwrap(message?: string): T;
    abstract map<T2>(map: (value: T) => T2): Result<T2, E>;
    abstract mapErr<E2>(map: (err: E) => E2): Result<T, E2>;
    abstract andThen<T2>(map: (value: T) => Result<T2, E>): Result<T2, E>;
}

export class OkResult<T, E> extends AbstractResult<T, E> {
    constructor(public readonly value: T) {
        super();
    }

    isOk(): this is OkResult<T, E> {
        return true;
    }
    isError(): this is ErrorResult<T, E> {
        return false;
    }
    unwrap() {
        return this.value;
    }
    map<T2>(map: (value: T) => T2): Result<T2, E> {
        return Result.ok(map(this.value));
    }
    mapErr<E2>(map: (err: E) => E2): Result<T, E2> {
        // @ts-expect-error error type matches
        return this;
    }
    andThen<T2>(map: (value: T) => Result<T2, E>): Result<T2, E> {
        return map(this.value);
    }
}

export class ErrorResult<T, E> extends AbstractResult<T, E> {
    constructor(public readonly error: E) {
        super();
    }

    isOk(): this is OkResult<T, E> {
        return false;
    }
    isError(): this is ErrorResult<T, E> {
        return true;
    }
    unwrap(message?: string): never {
        fail(`${message ?? "expected value"}: ${String(this.error)}`);
    }
    map<T2>(map: (value: T) => T2): Result<T2, E> {
        // @ts-expect-error error type matches
        return this;
    }
    mapErr<E2>(map: (err: E) => E2): Result<T, E2> {
        return Result.error(map(this.error));
    }
    andThen<T2>(map: (value: T) => Result<T2, E>): Result<T2, E> {
        // @ts-expect-error error type matches
        return this;
    }
}

// export type OkResult<T> = { readonly value: T; readonly error?: undefined };
// export type ErrorResult<E> = { readonly error: E; readonly ok?: undefined };
// export type Result<T, E> = OkResult<T> | ErrorResult<E>;

// // eslint-disable-next-line no-redeclare
// export const Result = {
//   ok<T>(value: T): OkResult<T> {
//     return { value: value };
//   },
//   error<E>(value: E): ErrorResult<E> {
//     return { error: value };
//   },
//   isOk<T, E>(result: Result<T, E>): result is OkResult<T> {
//     return has(result, 'value');
//   },
//   isError<T, E>(result: Result<T, E>): result is ErrorResult<E> {
//     return has(result, 'error');
//   },
//   unwrap<T>(result: Result<T, unknown>, message: string): T {
//     assert(Result.isOk(result), message);
//     return result.value;
//   },
//   map<T, E, T2>(result: Result<T, E>, map: (value: T) => T2): Result<T2, E> {
//     if (Result.isError(result)) {
//       return result;
//     }
//     return Result.ok(map(result.value));
//   },
//   mapErr<T, E, E2>(result: Result<T, E>, map: (error: E) => E2): Result<T, E2> {
//     if (Result.isOk(result)) {
//       return result;
//     }
//     return Result.error(map(result.error));
//   },
//   andThen<T, E, T2, E2>(
//     result: Result<T, E>,
//     map: (value: T) => Result<T2, E2>,
//   ): Result<T2, E | E2> {
//     if (Result.isError(result)) {
//       return result;
//     }
//     return map(result.value);
//   },
//   collect<T, E>(results: Array<Result<T, E>>): Result<Array<T>, E> {
//     const arr: Array<T> = [];
//     for (const result of results) {
//       if (Result.isOk(result)) {
//         arr.push(result.value);
//       } else {
//         return result;
//       }
//     }
//     return Result.ok(arr);
//   },
// };
