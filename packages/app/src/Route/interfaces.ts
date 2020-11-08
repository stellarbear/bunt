import {Action, ActionCtor, Context, IContext, Promisify} from "@typesafeunit/unit";
import {IRequest, RouteAction, RouteResponse} from "../interfaces";
import {Payload} from "../Payload";
import {Route} from "./Route";

export interface IRoute<A extends RouteAction = RouteAction> {
    readonly route: string;

    readonly action: ActionCtor<A>;

    readonly payload?: Payload<A>;

    test(route: string): boolean;

    match(route: string): Record<string, string>;
}

export type RouteNewArgs<A extends RouteAction> = A extends Action<IContext, infer S>
    ? S extends null | undefined | never
        ? [route: string, action: ActionCtor<A>]
        : [route: string, action: ActionCtor<A>, payload: Payload<A>]
    : never;

export type RouteNew = <A extends RouteAction>(...args: RouteNewArgs<A>) => Route<A>;
export type RouteMatcherFactory = (route: string) => IRouteMatcher;

export type RouteArgs<A extends RouteAction> = [ActionCtor<A>, RouteConfig<A>];

export interface IRouteContext<C extends IContext> {
    context: C;
    request: IRequest;
    args: Map<string, string>;
}

export type RouteStateSure<C extends Context, T> = |
    { [K in keyof T]-?: (context: IRouteContext<C>) => Promisify<T[K]> } |
    ((context: IRouteContext<C>) => Promisify<T>);

export type RouteConfigState<A> = A extends Action<infer C, infer S, RouteResponse>
    // eslint-disable-next-line @typescript-eslint/ban-types
    ? S extends object
        ? RouteStateSure<C, S>
        : never
    : never;

export type RouteConfigValidate<A> = A extends Action<infer C, any, RouteResponse>
    ? (context: IRouteContext<C>) => Promisify<void>
    : never;

export type RouteConfig<A> = RouteConfigState<A> extends never
    ? Pick<RouteConfigInner<A>, "route" | "validate">
    : Pick<RouteConfigInner<A>, "route" | "state" | "validate">;

export interface RouteConfigInner<A> {
    readonly route: string;
    readonly validate?: RouteConfigValidate<A>;
    readonly state: RouteConfigState<A>;
}

export interface IRouteMatcher {
    test(route: string): boolean;

    match(route: string): Record<string, string>;
}
