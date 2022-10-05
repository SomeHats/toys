import { useEffect, useRef } from "react";

export function useKeepNonNull<T>(value: T | null): T | null {
    const ref = useRef(value);
    useEffect(() => {
        if (value != null) {
            ref.current = value;
        }
    }, [value]);
    return value ?? ref.current;
}
