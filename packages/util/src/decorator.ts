import {assert} from "./assert";
import {DecoratorTarget} from "./interfaces";
import {isFunction, isUndefined} from "./is";

export function memoize(target: DecoratorTarget, key: string): PropertyDescriptor {
    const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
    assert(!isUndefined(descriptor));
    assert(
        isFunction(descriptor.value) || isFunction(descriptor.get),
        "Memoization should be apply only to methods",
    );

    const memoizeCache = new WeakMap();
    if (descriptor.value) {
        const fn = descriptor.value;
        descriptor.value = function memoizeCacheFunction(this: any, ...args: any[]) {
            if (!memoizeCache.has(this)) {
                memoizeCache.set(this, fn.call(this, args));
            }

            return memoizeCache.get(this);
        };
    }

    if (descriptor.get) {
        const fn = descriptor.get;
        descriptor.get = function memoizeCacheFunction(this: any) {
            if (!memoizeCache.has(this)) {
                memoizeCache.set(this, fn.call(this));
            }

            return memoizeCache.get(this);
        };
    }

    return descriptor;
}
