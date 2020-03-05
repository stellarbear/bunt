import {ActionCtor} from "@typesafeunit/unit";
import {RouteAction} from "../interfaces";
import {IRouteMatcher, RouteConfig, RouteConfigState, RouteConfigValidate} from "./interfaces";

export abstract class RouteAbstract<A extends RouteAction = RouteAction> {
    public readonly action: ActionCtor<A>;
    public readonly route: string;
    public readonly validate?: RouteConfigValidate<A>;
    public readonly state: RouteConfigState<A>;

    public abstract readonly matcher: IRouteMatcher;

    constructor(action: ActionCtor<A>, config: RouteConfig<A>) {
        this.route = config.route;
        this.action = action;
        this.validate = config.validate;
        this.state = config.state;
    }

    public test(route: string) {
        return this.matcher.test(route);
    }

    public match(route: string) {
        return this.matcher.match(route);
    }
}
