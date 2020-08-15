import {Context, ContextArg, unit, Unit} from "@typesafeunit/unit";
import {assert, isDefined, isFunction, isInstanceOf, isObject, logger, Logger} from "@typesafeunit/util";
import {IRequest, MatchRoute, RouteAction, RouteResponse} from "./interfaces";
import {RouteAbstract, RouteNotFound} from "./Route";
import {RequestAbstract} from "./Transport";

export class Application<U extends Unit<C>, C> {
    @logger
    public logger!: Logger;

    protected readonly unit: U;
    protected readonly route: RouteAbstract<RouteAction>[] = [];

    constructor(u: U) {
        this.unit = u;
    }

    public get size(): number {
        return this.route.length;
    }

    public static async factory<C extends Context>(
        context: ContextArg<C>,
        routes: MatchRoute<C, RouteAbstract<RouteAction>>[] = []): Promise<Application<Unit<C>, C>> {
        const app = new this<Unit<C>, C>(await unit(context));
        if (routes.length > 0) {
            routes.forEach((route) => app.add(route));
        }

        return app;
    }

    public add<R extends RouteAbstract<RouteAction>>(route: MatchRoute<C, R>): this {
        this.logger.debug("add", route);
        assert(!this.unit.has(route.action), `This route was already added`);
        this.unit.add(route.action);
        this.route.push(route);
        return this;
    }

    public remove<R extends RouteAbstract<RouteAction>>(route: MatchRoute<C, R>): this {
        if (this.unit.has(route.action)) {
            this.logger.debug("remove", route);
            this.unit.remove(route.action);
            const index = this.route.findIndex((item) => item === route);
            this.route.splice(index, index + 1);
        }

        return this;
    }

    public async handle(request: RequestAbstract): Promise<void> {
        const finish = this.logger.perf("handle", request);
        try {
            if (request.validate()) {
                await request.respond(await this.run(request));
            }
        } catch (error) {
            if (!request.complete) {
                await request.respond(error);
            }

            if (isInstanceOf(error, Error)) {
                throw error;
            }
        } finally {
            finish();
        }
    }

    public async run(request: IRequest): Promise<RouteResponse> {
        for (const route of this.route) {
            if (route.test(request.route)) {
                this.logger.debug("match", route);

                const state = {};
                const requestArgs = new Map<string, string>();
                const context = await this.unit.getContext();
                Object.entries(route.match(request.route))
                    .forEach(([key, value]) => requestArgs.set(key, value));

                const routeContext = {request, context, args: requestArgs};
                if (isFunction(route.validate)) {
                    await route.validate(routeContext);
                }

                if (isDefined(route.state)) {
                    if (isFunction(route.state)) {
                        Object.assign(state, await route.state(routeContext));
                    } else if (isObject(route.state)) {
                        for (const [name, factory] of Object.entries(route.state)) {
                            Reflect.set(state, name, await factory(routeContext));
                        }
                    }
                }

                return this.unit.run(route.action, state);
            }
        }

        throw new RouteNotFound(request.route);
    }

    public getRoutes(): RouteAbstract[] {
        return this.route;
    }
}
