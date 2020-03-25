import {assert, isBoolean} from "@typesafeunit/util";
import {ValidationAttributes} from "./interfaces";

export function createAssertion(fn: (v: any) => boolean, options?: ValidationAttributes | boolean) {
    const validator = (v: any) => assert(fn(v));
    if (isBoolean(options)) {
        return {required: options, validator};
    }

    if (options) {
        return {...options, validator};
    }

    return validator;
}
