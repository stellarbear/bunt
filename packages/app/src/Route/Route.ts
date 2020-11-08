import {ActionCtor} from "@typesafeunit/unit";
import {ILogable} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {Payload} from "../Payload";
import {IRoute, IRouteMatcher, RouteMatcherFactory, RouteNew, RouteNewArgs} from "./interfaces";

export class Route<A extends RouteAction = RouteAction> implements IRoute<A>, ILogable<{ route: string }> {
    public readonly route: string;
    public readonly action: ActionCtor<A>;
    public readonly payload?: Payload<A>;
    readonly #matcher: IRouteMatcher;

    constructor(matcher: RouteMatcherFactory, ...[route, action, payload]: RouteNewArgs<A>) {
        this.route = route;
        this.action = action as ActionCtor<A>;
        this.payload = payload as Payload<A>;
        this.#matcher = matcher(route);
    }

    public static create(matcher: RouteMatcherFactory): RouteNew {
        return <A extends RouteAction>(...args: RouteNewArgs<A>) => new Route<A>(matcher, ...args);
    }

    public getLogValue(): { route: string } {
        return {route: this.route};
    }

    public test(route: string): boolean {
        return this.#matcher.test(route);
    }

    public match(route: string): Record<string, string> {
        return this.#matcher.match(route);
    }
}
