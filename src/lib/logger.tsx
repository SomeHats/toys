let callCount = 0;
export function log9(...args: readonly unknown[]) {
    callCount++;
    if (callCount < 10) {
        console.log(`[log9 ${callCount}]`, ...args);
    }
}

export function trace9(...args: readonly unknown[]) {
    callCount++;
    if (callCount < 10) {
        console.trace(`[trace9 ${callCount}]`, ...args);
    }
}
