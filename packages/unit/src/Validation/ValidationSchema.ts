import {entriesReverse, isFunction, isObject, isUndefined} from "@typesafeunit/util";
import {ValidationAttributes, ValidationDescription, ValidationFunction, ValidationResult} from "./interfaces";
import {ValidationRule} from "./ValidationRule";

type ValidatorArg<T, K extends keyof T> = ValidationFunction<T, K>
    | [ValidationFunction<T, K>, string]
    | ValidationAttributes & { validator: ValidationFunction<T, K>; message?: string };

export class ValidationSchema<T> {
    protected readonly attributes: ValidationAttributes = {
        required: true,
        nullable: false,
    };

    protected readonly rules = new Map<keyof T, ValidationRule<T, any>>();

    constructor(defaultAttributes?: ValidationAttributes) {
        if (!isUndefined(defaultAttributes)) {
            this.attributes = {...this.attributes, ...defaultAttributes};
        }
    }

    public add<K extends keyof T>(key: K, options: ValidatorArg<T, K>) {
        const rule = this.ensure(key);
        if (isFunction(options) || options instanceof ValidationSchema) {
            rule.add(options);
            return this;
        }

        if (Array.isArray(options)) {
            rule.add(...options);
            return this;
        }

        if (isObject(options) && "validator" in options) {
            const {validator, message, ...attributes} = options;
            rule.add(validator, message);
            rule.setAttributes(attributes);
        }

        return this;
    }

    public async validate(state: Partial<T> | any = {}, message?: string): Promise<ValidationDescription<T>> {
        const validations: [keyof T, ValidationResult<T, keyof T>][] = [];
        for (const [key, rule] of this.rules.entries()) {
            validations.push([key, await rule.validate(state[key])]);
        }

        return {
            message,
            valid: !validations.some(([, value]) => !value.valid),
            validation: entriesReverse<ValidationResult<T, keyof T>>(validations),
        };
    }

    protected ensure<K extends keyof T>(key: K, attributes: ValidationAttributes = {}) {
        const rule = this.rules.get(key) || new ValidationRule<T, K>(key, this.attributes);
        if (!this.rules.has(key)) {
            this.rules.set(key, rule);
        }

        if (Object.keys(attributes).length > 0) {
            rule.setAttributes(attributes);
        }

        return rule;
    }
}
