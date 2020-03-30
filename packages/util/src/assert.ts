import {AssertionError} from "./Exception";
import {isFunction} from "./is";

export type AssertionDetailsAllowType = string | object | null | number;
export type AssertionDetails = (() => AssertionDetailsAllowType) | AssertionDetailsAllowType;
export type AssertionMessage = string | (() => string);

export function assert(expr: any, message?: AssertionMessage, details?: AssertionDetails): asserts expr {
    if (!expr) {
        throw new AssertionError(isFunction(message) ? message() : message, details);
    }
}

export function fails(expr: any, message?: AssertionMessage, details?: AssertionDetails) {
    if (!!expr) {
        throw new AssertionError(isFunction(message) ? message() : message, details);
    }
}

export function pass<T>(value: any, transform: (v: any) => T, validator: (v: any) => boolean, label?: string): T {
    assert(value, `${label || "Value"} should be defined`);

    const nextValue = transform(value);
    assert(
        validator(nextValue),
        `This ${label || "value"} "${nextValue}" should pass the validation stage: ${validator.toString()}`,
    );

    return nextValue;
}
