import {assert, fails, isFunction, isNull, isUndefined} from "@typesafeunit/util";
import {ValidationAttributes, ValidationFails, ValidationFunction, ValidationResult} from "./interfaces";
import {ValidationSchema} from "./ValidationSchema";

export class ValidationRule<T, K extends keyof T> {
    protected readonly key: K;
    protected readonly attributes: ValidationAttributes = {};
    protected readonly validators: [ValidationFunction<T, K>, string?][] = [];

    constructor(key: K, attributes: ValidationAttributes) {
        this.key = key;
        this.attributes = {...attributes};
    }

    public get required() {
        return this.attributes.required;
    }

    public get nullable() {
        return this.attributes.nullable;
    }

    public setAttributes(attributes: ValidationAttributes = {}) {
        Object.assign(this.attributes, {...attributes});
    }

    public add(validator: ValidationFunction<T, K>, message?: string) {
        this.validators.push([validator, message]);
    }

    public async validate(value: T[K]): Promise<ValidationResult<T, K>> {
        const attributes = this.attributes;
        if (!this.required && isUndefined(value)) {
            return {value, valid: true, ...attributes};
        }

        if (this.required && this.nullable && this.isNull(value)) {
            return {value, valid: true, ...attributes};
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return {value, valid: false, ...attributes};
            }

            for (const child of value) {
                const res = await this.validate(child);
                if (!res.valid) {
                    return {...res, value};
                }
            }

            return {value, valid: true, ...attributes};
        }

        const validators: [ValidationFunction<T, K>, string?][] = [];
        if (this.required) {
            validators.push([(v) => fails(isUndefined(v)), `The value of "${this.key}" should be defined`]);
        }

        if (!this.nullable) {
            validators.push([(v) => fails(isNull(v)), `The value of "${this.key}" shouldn't be null`]);
        }

        for (const [validator, message] of [...validators, ...this.validators]) {
            try {
                if (isFunction(validator)) {
                    validator(value);
                    continue;
                }

                assert(
                    validator instanceof ValidationSchema,
                    "Validator should be function or ValidationSchema",
                );

                const validation = await validator.validate(value);
                if (!validation.valid) {
                    return {value, message, validation, valid: false, ...attributes} as ValidationFails<any, any>;
                }
            } catch (error) {
                return {value, error, message, valid: false, ...attributes};
            }
        }

        return {value, valid: true};
    }

    protected isNull(value: any) {
        return isNull(value) || (Array.isArray(value) && value.length === 0);
    }
}
