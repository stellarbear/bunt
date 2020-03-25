import {memoize} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {RouteArgs} from "./interfaces";
import {RegexpMatcher} from "./Matcher/RegexpMatcher";
import {RouteAbstract} from "./RouteAbstract";

export class PathRoute<A extends RouteAction> extends RouteAbstract<A> {
    @memoize
    public get matcher(): RegexpMatcher {
        return new RegexpMatcher(this.route);
    }

    public static factory = <A extends RouteAction>(...args: RouteArgs<A>): PathRoute<A> => {
        return new PathRoute<A>(...args);
    };
}
