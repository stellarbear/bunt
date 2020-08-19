import {isInstanceOf, isObject} from "@typesafeunit/util";
import {IServiceResolver} from "../interfaces";
import {Service} from "./Service";

export const SERVICE_KIND = Symbol.for("SERVICE_KIND");

export function isService<T>(maybe: unknown): maybe is IServiceResolver<T> {
    if (!isObject(maybe)) {
        return false;
    }

    return isInstanceOf(maybe, Service)
        || (SERVICE_KIND in maybe && "resolve" in maybe);
}

export const resolve: PropertyDecorator = (p, k) => {
    Service.resolve()(p, k);
};
