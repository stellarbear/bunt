import {IServiceResolver} from "../interfaces";
import {Service} from "../Service";
import {Context} from "./Context";

export type ResolveService<T extends any> = T extends Service<infer S> ? Promise<S> : T;

export type ApplyContext<C extends Context> = {
    [K in keyof C]: C[K] extends IServiceResolver<infer M>
        ? M
        : C[K];
};

export type Ex<C, K> = K extends keyof C ? C[K] : never;

export type MatchContext<C extends any, T> = {
    [K in keyof T]: Ex<C, K> extends T[K]
        ? T[K]
        : Ex<C, K> extends IServiceResolver<infer M>
            ? M extends T[K]
                ? T[K] : ["The IServiceResolver<T> doesn't match context", Ex<C, K>, T[K]]
            : ["The input type doesn't match context", Ex<C, K>, T[K]];
};
