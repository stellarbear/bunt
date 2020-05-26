import {assert, isBoolean} from "@typesafeunit/util";
import {ValidationAttributes} from "./interfaces";

// @TODO
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createAssertion(fn: (v: unknown) => boolean, options?: ValidationAttributes | boolean) {
    const validator = (v: any) => assert(fn(v));
    if (isBoolean(options)) {
        return {required: options, validator};
    }

    if (options) {
        return {...options, validator};
    }

    return validator;
}
