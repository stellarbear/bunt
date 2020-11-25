import {ActionCtor} from "@typesafeunit/unit";
import {ILogable, isFunction, isString} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {Payload} from "../Payload";
import {IRoute, IRouteMatcher, RouteFactory, RouteMatcherFactory, RouteRuleArg} from "./interfaces";
import {RouteRule} from "./RouteRule";

export class Route<A extends RouteAction = RouteAction> implements IRoute<A>, ILogable<{ route: string }> {
    public readonly route: string;
    public readonly action: ActionCtor<A>;
    public readonly payload?: Payload<A>;
    readonly #matcher: IRouteMatcher;

    constructor(matcher: RouteMatcherFactory, action: ActionCtor<A>, rule: RouteRuleArg<A>) {
        const {route, payload} = this.getRuleArgs(rule);
        this.route = route;
        this.action = action;
        this.payload = payload;

        this.#matcher = isFunction(matcher) ? matcher(this.route) : matcher;
    }

    public static create(matcher: RouteMatcherFactory): RouteFactory {
        return <A extends RouteAction>(action: ActionCtor<A>, rule: RouteRuleArg<A>) => (
            new Route<A>(matcher, action, rule)
        );
    }

    private getRuleArgs(rule: string | RouteRule<A>): { route: string, payload?: Payload<A> } {
        if (isString(rule)) {
            return {route: rule, payload: undefined};
        }

        return {route: rule.route, payload: rule};
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
