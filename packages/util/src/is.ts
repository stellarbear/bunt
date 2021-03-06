import {Ctor, Newable} from "./interfaces";

export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
export const isVoid = (value: unknown): value is void | undefined => typeof value === "undefined";
export const isDefined = <T>(value: T | undefined): value is Exclude<T, undefined> => typeof value !== "undefined";
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isString = (value: unknown): value is string => typeof value === "string";
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
export const isNumber = (value: unknown): value is number => {
    return typeof value === "number" && value === +value;
};

export const isFunction = <T extends (...args: any) => any>(value: unknown): value is T => {
    return typeof value === "function" && !isClass(value);
};

export const isArrowFunction = <T, A extends any[]>(value: unknown): value is (...args: A[]) => T => {
    return typeof value === "function" && isUndefined(value.prototype);
};

export const isClass = (value: unknown): value is () => any => {
    return typeof value === "function" && value.toString().startsWith("class");
};

export const isObject = <T extends Record<any, any>>(value: T | any): value is T => {
    return typeof value === "object" && !isNull(value) && !Array.isArray(value);
};

export const isError = (value: unknown): value is Error => {
    return typeof value === "object" && isInstanceOf(value, Error);
};

export type IIS<T> = T extends Ctor<infer S> ? S : T extends Newable<infer S> ? S : T;
export const isInstanceOf = <C extends (Ctor | Newable)>(value: unknown, type: C): value is IIS<C> => {
    return isObject(value) && value instanceof type;
};
