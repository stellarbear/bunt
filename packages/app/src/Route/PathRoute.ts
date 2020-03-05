import {memoize} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {RouteArgs} from "./interfaces";
import {RouteAbstract} from "./RouteAbstract";
import {RegexpMatcher} from "./Matcher/RegexpMatcher";

export class PathRoute<A extends RouteAction> extends RouteAbstract<A> {
    @memoize
    public get matcher() {
        return new RegexpMatcher(this.route);
    }

    public static factory = <A extends RouteAction>(...args: RouteArgs<A>) => {
        return new PathRoute<A>(...args);
    };
}
