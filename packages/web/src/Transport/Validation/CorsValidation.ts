import {Application, IRouteMatcher, PathRoute, RequestValidatorAbstract, RouteAbstract} from "@typesafeunit/app";
import {isFunction, isInstanceOf, isString} from "@typesafeunit/util";
import {Headers} from "../Headers";
import {ICorsOptions} from "../interfaces";
import {Request} from "../Request";
import {NoContentResponse} from "../Response";

export class CorsValidation extends RequestValidatorAbstract<ICorsOptions> {
    #table: [IRouteMatcher, string][] = [];

    public get origin(): ICorsOptions["origin"] {
        return this.options.origin;
    }

    public factory(app: Application<any, any>, options: ICorsOptions): CorsValidation {
        const validator = new CorsValidation(options);
        validator.updateRoutes(app);
        return validator;
    }

    public validate(request: Request): void {
        const AccessControlAllowMethods = new Set<string>();
        if (request.isOptionsRequest()) {
            // Test route for the current OPTIONS request
            if (this.#table.some(([matcher]) => matcher.test(request.route))) {
                return;
            }

            for (const [matcher, method] of this.#table) {
                const route = request.route.replace("OPTIONS", method);
                if (matcher.test(route)) {
                    AccessControlAllowMethods.add(method);
                }
            }

            const methods = [...AccessControlAllowMethods.values()];
            const headers = this.getAccessControlHeaders(request, methods);
            throw new NoContentResponse({headers: new Headers(headers)});
        }

        request.setResponseHeaders([["Access-Control-Allow-Origin", this.getOrigin(request)]]);
    }

    protected getAccessControlHeaders(request: Request, methods: string[]): [string, string][] {
        const acRequestHeaders = request.headers.get(
            "Access-Control-Request-Headers",
            "Content-Type, Accept, Authorization",
        );

        return [
            ["Access-Control-Allow-Origin", this.getOrigin(request)],
            ["Access-Control-Allow-Headers", acRequestHeaders],
            ["Access-Control-Allow-Methods", methods.join(", ")],
            ["Access-Control-Max-Age", "86400"],
        ];
    }

    protected getOrigin(request: Request): string {
        if (isString(this.origin)) {
            return this.origin;
        }

        if (isFunction(this.origin)) {
            return this.origin(request);
        }

        return "*";
    }

    protected updateRoutes(app: Application<any, any>): void {
        const transform = (route: RouteAbstract): [IRouteMatcher, string] => [
            route.matcher,
            route.route.replace(/\s+.+/, ""),
        ];

        this.#table = app.getRoutes()
            .filter((route) => isInstanceOf(route, PathRoute))
            .map(transform);
    }
}
