import {ActionContext, ActionState} from "@typesafeunit/unit";
import {isFunction, isObject} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {IRouteContext} from "../Route";

type ResolverFn<A extends RouteAction> = (context: IRouteContext<ActionContext<A>>) => ActionState<A> | unknown;
type ResolverType<A extends RouteAction> = ActionState<A> | ResolverFn<A>;

type ResolverList<A extends RouteAction> = {
    [K in keyof ActionState<A>]-?: ResolverType<A>;
};

type ResolverResolvers<A extends RouteAction> = ResolverFn<A>
    | ResolverList<A>;

export class Resolver<A extends RouteAction> {
    readonly resolvers: ResolverResolvers<A>;

    constructor(resolvers: ResolverResolvers<A>) {
        this.resolvers = resolvers;
    }

    public async resolve(context: IRouteContext<ActionContext<A>>): Promise<ActionState<A>> {
        const state = {};
        const {resolvers} = this;
        if (isFunction(resolvers)) {
            Object.assign(state, await resolvers(context));
        } else if (isObject(resolvers)) {
            for (const [name, resolver] of Object.entries(resolvers)) {
                if (isFunction(resolver)) {
                    Reflect.set(state, name, await resolver(context));
                } else {
                    Reflect.set(state, name, resolver);
                }
            }
        }

        return state as ActionState<A>;
    }
}
