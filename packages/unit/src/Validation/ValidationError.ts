import {ILogable, IReadableError} from "@typesafeunit/util";
import {ValidationDescription, ValidationResult, ValidationSafeJSON, ValidationSafeValue} from "./interfaces";

export interface IValidationLogValue {
    error: string;
    validation: ValidationSafeValue[];
}

export class ValidationError<T> extends Error implements IReadableError, ILogable<IValidationLogValue> {
    public readonly description: ValidationDescription<T>;

    constructor(message: string, description: ValidationDescription<T>) {
        super(message);
        this.description = description;
    }

    public toSafeString(): string {
        const {message, description} = this;
        return description.message || message || this.message;
    }

    public toSafeJSON(): ValidationSafeJSON {
        return {
            error: this.toSafeString(),
            validation: this.getValidationErrors(this.description),
            payload: this.description.state,
        };
    }

    public getLogValue(): IValidationLogValue {
        return this.toSafeJSON();
    }

    private getValidationErrors(description: ValidationDescription<T>): ValidationSafeValue[] {
        if (description.valid) {
            return [];
        }

        const result = [];
        const {validation} = description;
        for (const [field, res] of Object.entries<ValidationResult<any, any>>(validation)) {
            if (!res.valid && res.validation) {
                result.push({field, validation: this.getValidationErrors(res.validation)});
                continue;
            }

            if (!res.valid) {
                result.push({field, message: res.message || res.error?.message, input: res.value});
            }
        }

        return result;
    }
}
