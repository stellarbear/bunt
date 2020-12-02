export function createAsyncTimeout(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export function wait<T = unknown>(fn: (re: (v: T) => void) => void): Promise<T> {
    return new Promise((resolve) => {
        fn(resolve);
    });
}

export async function watch<T>(expected: T, fn: () => Promise<T>): Promise<void> {
    while (expected !== await fn()) {}
}

export function throttle<A extends any[], R>(fn: (...args: A) => R, t = 100): (...args: A) => Promise<R> {
    return async (...args: A): Promise<R> => {
        await createAsyncTimeout(t);
        return fn(...args);
    };
}
