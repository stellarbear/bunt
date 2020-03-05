import {IServiceResolver} from "../interfaces";
import {Service} from "../Service";
import {Context} from "./Context";

export type ResolveService<T extends any> = T extends Service<infer S> ? Promise<S> : T;

export type ApplyContext<C extends Context> = {
    [K in keyof C]: C[K] extends IServiceResolver<infer M>
        ? M
        : C[K];
};

export type MatchContext<C extends any, T> = {
    [K in keyof T]: C[K] extends T[K]
        ? T[K]
        : C[K] extends IServiceResolver<infer M>
            ? M extends T[K]
                ? T[K] : ["The IServiceResolver<T> doesn't match context", C[K], T[K]]
            : ["The input type doesn't match context", C[K], T[K]];
};
