import {isObject} from "@typesafeunit/util";
import {Service} from "../Service";
import {ApplyContext, ResolveService} from "./interfaces";

const weakCache = new WeakMap();

export class Context {
    public static async resolve<T extends any>(value: T): Promise<ResolveService<T>> {
        if (isObject(value) && Object.getPrototypeOf(value) instanceof Service) {
            return await value.resolve();
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
        const descriptionMap: PropertyDescriptorMap = Object.getOwnPropertyDescriptors(context);
        for (const key of Service.getRef(context)) {
            if (Reflect.has(context, key)) {
                const value = await this.resolve(Reflect.get(context, key));
                Reflect.set(descriptionMap, key, {enumerable: true, writable: false, configurable: false, value});
            }
        }

        return Object.create(Object.getPrototypeOf(context), descriptionMap);
    }
}
