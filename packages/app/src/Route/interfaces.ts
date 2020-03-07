import {Action, ActionCtor, IContext, Promisify} from "@typesafeunit/unit";
import {IRequest, RouteAction, RouteResponse} from "../interfaces";
import {RouteAbstract} from "./RouteAbstract";

export type RouteFactory<A extends RouteAction> = (action: ActionCtor<A>, config: RouteConfig<A>)
    => RouteAbstract<A>;

export type RouteArgs<A extends RouteAction> = [ActionCtor<A>, RouteConfig<A>];

export interface IRouteContext<C extends IContext> {
    context: C;
    request: IRequest;
    args: Map<string, string>;
}

export type RouteConfigState<A> = A extends Action<infer C, infer S, RouteResponse>
    ? S extends object
        ? { [K in keyof S]: (context: IRouteContext<C>) => Promisify<S[K]> }
        : never
    : never;

export type RouteConfigValidate<A> = A extends Action<infer C, any, RouteResponse>
    ? (context: IRouteContext<C>) => Promisify<void>
    : never;

export type RouteConfig<A> = RouteConfigState<A> extends never
    ? Pick<RouteConfigInner<A>, "route" | "validate">
    : RouteConfigInner<A>;

export interface RouteConfigInner<A> {
    readonly route: string;
    readonly validate?: RouteConfigValidate<A>;
    readonly state: RouteConfigState<A>;
}

export interface IRouteMatcher {
    test(route: string): boolean;

    match(route: string): object;
}
