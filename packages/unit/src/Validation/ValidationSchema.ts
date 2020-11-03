import {entriesReverse, isFunction, isObject, isUndefined, logger, Logger} from "@typesafeunit/util";
import {ValidationAttributes, ValidationDescription, ValidationResult, ValidatorArg} from "./interfaces";
import {ValidationError} from "./ValidationError";
import {ValidationRule} from "./ValidationRule";

export class ValidationSchema<T> {
    @logger
    public readonly logger!: Logger;

    protected readonly attributes: ValidationAttributes = {
        required: true,
        nullable: false,
        clear: true,
    };

    protected readonly rules = new Map<keyof T, ValidationRule<T, any>>();

    constructor(defaultAttributes?: ValidationAttributes) {
        if (!isUndefined(defaultAttributes)) {
            this.attributes = {...this.attributes, ...defaultAttributes};
        }
    }

    public getAttribute<K extends keyof ValidationAttributes>(key: K): ValidationAttributes[K] {
        return this.attributes[key];
    }

    public setAttribute<K extends keyof ValidationAttributes>(key: K, value: ValidationAttributes[K]): this {
        this.attributes[key] = value;
        return this;
    }

    public add<K extends keyof T>(key: K, options: ValidatorArg<T, K>): ValidationSchema<T> {
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

    public assert(description: ValidationDescription<T>, message?: string): void {
        if (!description.valid) {
            throw new ValidationError(message || "Validation failed", description);
        }
    }

    public async validate(state: Partial<T> | any = {}, message?: string): Promise<ValidationDescription<T>> {
        const finish = this.logger.perf("validate", {validator: this.constructor.name, state});
        try {
            const validations: [keyof T, ValidationResult<T, keyof T>][] = [];
            for (const [key, rule] of this.rules.entries()) {
                validations.push([key, await rule.validate(state[key])]);
            }

            if (this.attributes.clear && isObject(state)) {
                for (const key of Object.keys(state)) {
                    if (!this.rules.has(key as keyof T)) {
                        delete state[key];
                    }
                }
            }

            return {
                message,
                valid: !validations.some(([, value]) => !value.valid),
                validation: entriesReverse<ValidationResult<T, keyof T>>(validations),
                state,
            };
        } finally {
            finish();
        }
    }

    protected ensure<K extends keyof T>(key: K, attributes: ValidationAttributes = {}): ValidationRule<T, K> {
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
