import {ActionContext, ActionState} from "@bunt/unit";
import {RouteAction} from "../interfaces";
import {IRouteContext} from "../Route";

export type ResolverFn<A extends RouteAction> = (context: IRouteContext<ActionContext<A>>) => ActionState<A> | unknown;
export type ResolverType<A extends RouteAction> = ActionState<A> | ResolverFn<A>;

export type ResolverList<A extends RouteAction> = {
    [K in keyof ActionState<A>]-?: ResolverType<A>;
};

export type ResolverResolvers<A extends RouteAction> = ResolverFn<A>
    | ResolverList<A>;
