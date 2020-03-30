export const isNull = (value: any): value is null => value === null;
export const isUndefined = (value: any): value is undefined => typeof value === "undefined";
export const isDefined = <T>(value: T | undefined): value is T => typeof value !== "undefined";
export const isBoolean = (value: any): value is boolean => typeof value === "boolean";
export const isString = (value: any): value is string => typeof value === "string";
export const isArray = <T>(value: any): value is T[] => Array.isArray(value);
export const isNumber = (value: any): value is number => value === +value;

export const isFunction = (value: any): value is (...args: any[]) => any => {
    return typeof value === "function" && isUndefined(value.prototype);
};


export type Ctor<T = any, A extends any[] = any[]> = { new(...args: A): T };
export const isInstanceOf = <T extends Ctor>(value: any, type: T): value is T => value instanceof type;
export const isObject = (value: any): value is object => !isNull(value) && typeof value === "object";
export const isClass = (value: any): value is () => any => typeof value === "function" && isObject(value.prototype);
export const isError = (value: any): value is Error => typeof value === "object" && value instanceof Error;
