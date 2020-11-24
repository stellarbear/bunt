import {ActionCtor} from "@typesafeunit/unit";
import {ILogable} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {Payload} from "../Payload";
import {IRoute, IRouteMatcher, MayPayload, RouteMatcherFactory, RouteNew} from "./interfaces";

export class Route<A extends RouteAction = RouteAction> implements IRoute<A>, ILogable<{ route: string }> {
    public readonly route: string;
    public readonly action: ActionCtor<A>;
    public readonly payload?: Payload<A>;
    readonly #matcher: IRouteMatcher;

    constructor(matcher: RouteMatcherFactory, action: ActionCtor<A>, route: string, payload?: Payload<A>) {
        this.route = route;
        this.action = action;
        this.payload = payload;
        this.#matcher = matcher(route);
    }

    public static create(matcher: RouteMatcherFactory): RouteNew {
        return <A extends RouteAction>(action: ActionCtor<A>, route: string, payload: MayPayload<A>) => (
            new Route<A>(matcher, action, route, payload)
        );
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
