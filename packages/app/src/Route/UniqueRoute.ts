import {memoize} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {RouteArgs} from "./interfaces";
import {EqualMatcher} from "./Matcher/EqualMatcher";
import {RouteAbstract} from "./RouteAbstract";

export class UniqueRoute<A extends RouteAction> extends RouteAbstract<A> {
    @memoize
    public get matcher(): EqualMatcher {
        return new EqualMatcher(this.route);
    }

    public static factory = <A extends RouteAction>(...args: RouteArgs<A>): UniqueRoute<A> => {
        return new UniqueRoute<A>(...args);
    };
}
