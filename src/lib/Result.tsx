import { fail } from "@/lib/assert";
import { entries, ObjectMap, ReadonlyRecord } from "@/lib/utils";

export type Result<T, E> = OkResult<T> | ErrorResult<E>;
export const Result = {
    ok<T>(value: T): OkResult<T> {
        return new OkResult(value);
    },
    error<E>(error: E): ErrorResult<E> {
        return new ErrorResult(error);
    },
    collect<T, E>(results: Array<Result<T, E>>): Result<Array<T>, E> {
        const arr: Array<T> = [];
        for (const result of results) {
            if (result.isOk()) {
                arr.push(result.value);
            } else {
                return result;
            }
        }
        return Result.ok(arr);
    },
    collectObject<E, Results extends ReadonlyRecord<string, Result<unknown, E>>>(
        results: Results,
    ): Result<{ [K in keyof Results]: Results[K] extends Result<infer T, E> ? T : never }, E> {
        const object: ObjectMap<string, unknown> = {};
        for (const [key, result] of entries(results)) {
            if (result.isOk()) {
                object[key] = result.value;
            } else {
                return result;
            }
        }
        return Result.ok(
            object as { [K in keyof Results]: Results[K] extends Result<infer T, E> ? T : never },
        );
    },
};

export abstract class AbstractResult<T, E> {
    constructor() {}

    abstract isOk(): this is OkResult<T>;
    abstract isError(): this is ErrorResult<E>;
    abstract unwrap(message?: string): T;
    abstract unwrapError(message?: string): E;
    abstract map<T2>(map: (value: T) => T2): Result<T2, E>;
    abstract mapErr<E2>(map: (err: E) => E2): Result<T, E2>;
    abstract andThen<T2>(map: (value: T) => Result<T2, E>): Result<T2, E>;
}

export class OkResult<T> extends AbstractResult<T, never> {
    constructor(public readonly value: T) {
        super();
    }

    isOk(): this is OkResult<T> {
        return true;
    }
    isError(): false {
        return false;
    }
    unwrap() {
        return this.value;
    }
    unwrapError(message?: string | undefined): never {
        fail(`${message ?? "expected error"}: ${String(this.value)}`);
    }
    map<T2>(map: (value: T) => T2): Result<T2, never> {
        return Result.ok(map(this.value));
    }
    mapErr(map: (err: never) => void): OkResult<T> {
        return this;
    }
    andThen<T2, E>(map: (value: T) => Result<T2, E>): Result<T2, E> {
        return map(this.value);
    }
}

export class ErrorResult<E> extends AbstractResult<never, E> {
    constructor(public readonly error: E) {
        super();
    }

    isOk(): false {
        return false;
    }
    isError(): this is ErrorResult<E> {
        return true;
    }
    unwrap(message?: string): never {
        if (this.error instanceof Error) {
            throw this.error;
        }
        fail(`${message ?? "expected value"}: ${String(this.error)}`);
    }
    unwrapError(message?: string | undefined): E {
        return this.error;
    }
    map(map: (value: never) => void): Result<never, E> {
        return this;
    }
    mapErr<E2>(map: (err: E) => E2): Result<never, E2> {
        return Result.error(map(this.error));
    }
    andThen(map: (value: never) => void): Result<never, E> {
        return this;
    }
}
