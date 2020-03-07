import {Context, ContextArg, unit, Unit} from "@typesafeunit/unit";
import {assert, isFunction, isObject} from "@typesafeunit/util";
import {IRequest, MatchRoute, RouteAction, RouteResponse} from "./interfaces";
import {RouteAbstract} from "./Route";
import {TransportAbstract} from "./Transport";

export class Application<U extends Unit<C>, C> {
    protected readonly unit: U;
    protected readonly route: RouteAbstract<RouteAction>[] = [];

    constructor(u: U) {
        this.unit = u;
    }

    public get size() {
        return this.route.length;
    }

    public static async factory<C extends Context>(context: ContextArg<C>) {
        return new this<Unit<C>, C>(await unit(context));
    }

    public add<R extends RouteAbstract<RouteAction>>(route: MatchRoute<C, R>) {
        assert(!this.unit.has(route.action), `This route was already added`);
        this.unit.add(route.action);
        this.route.push(route);
        return this;
    }

    public remove<R extends RouteAbstract<RouteAction>>(route: MatchRoute<C, R>) {
        if (this.unit.has(route.action)) {
            this.unit.remove(route.action);
            const index = this.route.findIndex((item) => item === route);
            this.route.splice(index, index + 1);
        }

        return this;
    }

    public async handle(transport: TransportAbstract) {
        try {
            await transport.respond(await this.run(transport.request));
        } catch (error) {
            if (!transport.sent) {
                await transport.respond({code: 500, status: error.message});
            }

            throw error;
        }
    }

    public async run(request: IRequest): Promise<RouteResponse> {
        for (const route of this.route) {
            if (route.test(request.route)) {
                const state = {};
                const requestArgs = new Map<string, string>();
                const context = await this.unit.getContext();
                Object.entries(route.match(request.route))
                    .forEach(([key, value]) => requestArgs.set(key, value));

                const routeContext = {request, context, args: requestArgs};
                if (isFunction(route.validate)) {
                    await route.validate(routeContext);
                }

                if (isObject(route.state)) {
                    for (const [name, factory] of Object.entries(route.state)) {
                        Reflect.set(state, name, await factory(routeContext));
                    }
                }

                return this.unit.run(route.action, state);
            }
        }

        return {code: 404, status: "Page not found"};
    }
}
