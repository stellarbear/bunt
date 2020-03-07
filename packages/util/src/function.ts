export const noop = () => void 0;
export function curry<A extends any[], T, S>(fn: (arg1: T, ...args: A) => S, value: T) {
    return (...args: A) => {
        return fn(value, ...args);
    };
}
