import {match, MatchFunction, pathToRegexp} from "path-to-regexp";
import {IRouteMatcher} from "../interfaces";

export class RegexpMatcher implements IRouteMatcher {
    protected readonly route: string;
    protected readonly matcher: MatchFunction;
    protected readonly tester: RegExp;
    constructor(route: string) {
        this.route = route;
        this.tester = pathToRegexp(route);
        this.matcher = match(route);
    }

    public match(route: string): object {
        return (this.matcher(route) || {params: {}}).params;
    }

    public test(route: string): boolean {
        return this.tester.test(route);
    }

}
