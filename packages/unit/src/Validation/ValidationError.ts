import {ILogable} from "@typesafeunit/util";
import {ISafeReadableError} from "@typesafeunit/util/dist/Exception/interfaces";
import {ValidationDescription, ValidationResult, ValidationSafeValue} from "./interfaces";

export class ValidationError<T> extends Error implements ISafeReadableError, ILogable<object> {
    public readonly description: ValidationDescription<T>;

    constructor(message: string, description: ValidationDescription<T>) {
        super(message);
        this.description = description;
    }

    public toSafeString(): string {
        return this.message;
    }

    public toSafeJSON(): object {
        const {message, description} = this;
        return {
            error: description.message || message,
            validation: this.getValidationErrors(description),
        };
    }

    public getLogValue(): object {
        return this.toSafeJSON();
    }

    private getValidationErrors(description: ValidationDescription<T>): ValidationSafeValue[] {
        if (description.valid) {
            return [];
        }

        const errors = [];
        const {validation} = description;
        for (const [field, res] of Object.entries<ValidationResult<any, any>>(validation)) {
            if (!res.valid) {
                errors.push({field, message: res.message || res.error?.message, input: res.value});
            }

            if (!res.valid && res.validation) {
                errors.push(...this.getValidationErrors(res.validation));
            }
        }

        return errors;
    }
}
