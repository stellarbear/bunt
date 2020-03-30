export const noop = () => void 0;

export function not<A extends any[]>(fn: (...args: A) => boolean) {
    return (...args: A) => {
        return !fn(...args);
    };
}

export function curry<A extends any[], T, S>(fn: (arg1: T, ...args: A) => S, value: T) {
    return (...args: A) => {
        return fn(value, ...args);
    };
}

export function safe<A extends any[], R>(fn: (...args: A) => R) {
    return async (...args: A) => {
        try {
            return await fn(...args);
        } catch (error) {
            // do something
        }
    };
}

export function isolate<A extends any[], R>(fn: (...args: A) => any) {
    return (...args: A) => {
        process.nextTick(() => fn(...args));
    };
}

export const fn = {
    noop,
    curry,
    safe,
    isolate,
};
