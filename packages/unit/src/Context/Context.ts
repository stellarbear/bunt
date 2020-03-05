import {getClassName, isObject} from "@typesafeunit/util";
import {performance} from "perf_hooks";
import {Service} from "../Service";
import {ApplyContext, ResolveService} from "./interfaces";

const weakCache = new WeakMap();
const mark = (target: object, n: string) => {
    return `${n} (${getClassName(target)})`;
};

export class Context {
    public static async resolve<T extends any>(value: T): Promise<ResolveService<T>> {
        if (isObject(value) && Object.getPrototypeOf(value) instanceof Service) {
            performance.mark(mark(value, "run"));
            const resolve = await value.resolve();
            performance.mark(mark(value, "finish"));
            performance.measure(
                mark(value, "Context.resolve"),
                mark(value, "resolve"),
                mark(value, "finish"),
            );

            return resolve;
        }

        return value as any;
    }

    public static async apply<C extends Context>(context: C): Promise<ApplyContext<C>> {
        const solved = weakCache.get(context) || await this.resolveContext(context);
        if (!weakCache.has(context)) {
            weakCache.set(context, solved);
        }

        return solved;
    }

    protected static async resolveContext<C extends Context>(context: C): Promise<ApplyContext<C>> {
        performance.mark(mark(context, "run"));
        const descriptionMap: PropertyDescriptorMap = Object.getOwnPropertyDescriptors(context);
        for (const key of Service.getRef(context)) {
            if (Reflect.has(context, key)) {
                const value = await this.resolve(Reflect.get(context, key));
                Reflect.set(descriptionMap, key, {enumerable: true, writable: false, configurable: false, value});
            }
        }

        const object = Object.create(Object.getPrototypeOf(context), descriptionMap);

        performance.mark(mark(context, "finish"));
        performance.measure(
            mark(context, "Context.resolveContext"),
            mark(context, "run"),
            mark(context, "finish"),
        );

        return object;
    }
}
