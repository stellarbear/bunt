import {isObject, Logger} from "@typesafeunit/util";
import {Service} from "../Service";
import {ApplyContext, ResolveService} from "./interfaces";

const weakCache = new WeakMap();

export class Context {
    public static logger = Logger.factory(Context);

    public static async resolve<T extends any>(value: T): Promise<ResolveService<T>> {
        if (isObject(value) && Object.getPrototypeOf(value) instanceof Service) {
            return value.resolve();
        }

        return value as any;
    }

    public static async apply<C extends Context>(context: C): Promise<ApplyContext<C>> {
        const solved = weakCache.get(context) || await this.getResolvedContext(context);
        if (!weakCache.has(context)) {
            weakCache.set(context, solved);
        }

        return solved;
    }

    protected static async getResolvedContext<C extends Context>(context: C): Promise<ApplyContext<C>> {
        const name = context.constructor.name;
        const finish = this.logger.perf("Resolve context", {context: name});
        try {
            const descriptionMap: PropertyDescriptorMap = Object.getOwnPropertyDescriptors(context);
            for (const key of Service.getReferences(context, Context)) {
                if (Reflect.has(context, key)) {
                    const service: Service<any> = Reflect.get(context, key);
                    const finishResolve = this.logger.perf(
                        "Resolve service",
                        {key, context: name, service: service.constructor.name},
                    );

                    try {
                        const value = await this.resolve(service);
                        Reflect.set(descriptionMap, key, {
                            enumerable: true,
                            writable: false,
                            configurable: false,
                            value,
                        });
                    } finally {
                        finishResolve();
                    }
                }
            }

            return Object.create(Object.getPrototypeOf(context), descriptionMap);
        } finally {
            finish();
        }
    }
}
