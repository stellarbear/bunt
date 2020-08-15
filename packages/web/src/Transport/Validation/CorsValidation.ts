import {
    Application,
    IRouteMatcher,
    PathRoute,
    RequestValidatorAbstract,
    RouteAbstract,
    RouteNotFound,
} from "@typesafeunit/app";
import {assert, isDefined, isFunction, isInstanceOf, isString} from "@typesafeunit/util";
import {Headers} from "../Headers";
import {ICorsOptions} from "../interfaces";
import {Request} from "../Request";
import {NoContentResponse} from "../Response";

export class CorsValidation extends RequestValidatorAbstract<ICorsOptions> {
    #table: [IRouteMatcher, string][] = [];

    public get origin(): ICorsOptions["origin"] {
        return this.options.origin;
    }

    public static factory(app: Application<any, any>, options: ICorsOptions = {}): CorsValidation {
        const validator = new this(options);
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

            let found = false;
            for (const [matcher, method] of this.#table) {
                const route = request.route.replace("OPTIONS", method);
                if (matcher.test(route)) {
                    AccessControlAllowMethods.add(method);
                    found = true;
                }
            }

            assert(found, () => new RouteNotFound("Not Found"));
            const methods = [...AccessControlAllowMethods.values()];
            const headers = this.getAccessControlHeaders(request, methods);
            throw new NoContentResponse({headers: new Headers(headers)});
        }

        const setHeaders: [string, string][] = [
            ["access-control-allow-origin", this.getAccessControlOrigin(request)],
        ];

        const vary = this.getVary();
        if (vary) {
            setHeaders.push(["Vary", vary]);
        }

        request.setResponseHeaders(setHeaders);
    }

    protected getAccessControlHeaders(request: Request, methods: string[]): [string, string][] {
        const acRequestHeaders = request.headers.get(
            "access-control-request-headers",
            "content-type, accept, authorization",
        );

        const headers: [string, string][] = [
            ["access-control-allow-origin", this.getAccessControlOrigin(request)],
            ["access-control-allow-headers", acRequestHeaders],
            ["access-control-allow-methods", methods.join(", ")],
            ["access-control-max-age", "86400"],
        ];

        const vary = this.getVary();
        if (vary) {
            headers.push(["Vary", vary]);
        }

        if (isDefined(this.options.credentials)) {
            headers.push(["access-control-allow-credentials", this.options.credentials ? "true" : "false"]);
        }

        return headers;
    }

    protected getVary(): string | undefined {
        if (isString(this.options.origin) && this.options.origin === "origin") {
            return "Origin";
        }

        return;
    }

    protected getAccessControlOrigin(request: Request): string {
        if (isString(this.origin)) {
            return this.origin === "origin" ? request.origin : this.origin;
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
