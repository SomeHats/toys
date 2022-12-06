let callCount = 0;
export function log9(...args: ReadonlyArray<unknown>) {
    callCount++;
    if (callCount < 10) {
        console.log(`[log9 ${callCount}]`, ...args);
    }
}
