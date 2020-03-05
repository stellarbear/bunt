export type ProfilerFunction<A extends any[] = any[], T = unknown> = (...args: A) => T;
export type ProfilerConfig = { [key: string]: null | ProfilerFunction };

export type ProfileFireArgs<T extends ProfilerConfig,
    K extends keyof T> = T[K] extends ProfilerFunction<any, infer A>
    ? [A | (() => A)]
    : [];

export type ProfileEvent<T extends ProfilerConfig,
    K extends keyof T> = {
    type: K;
    payload: T[K] extends () => infer P ? P : never;
};
