import {IRouteMatcher} from "../interfaces";

export class EqualMatcher implements IRouteMatcher {
    protected readonly route: string;

    constructor(route: string) {
        this.route = route;
    }

    public match(route: string): object {
        return {route};
    }

    public test(route: string): boolean {
        return route === this.route;
    }
}
