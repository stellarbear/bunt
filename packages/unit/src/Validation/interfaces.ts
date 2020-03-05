import {ValidationSchema} from "./ValidationSchema";

export type ValidationFunction<T, K extends keyof T> = ((value: T[K]) => void) | ValidationSchema<T[K]>;
export type ValidationAttributes = {
    required?: boolean;
    nullable?: boolean;
};

export type ValidationSuccess<T, K extends keyof T> = {
    value: T[K];
    valid: true;
};

export type ValidationFails<T, K extends keyof T> = {
    value?: unknown;
    valid: false;
    message?: string;
    error?: Error;
    validation?: ValidationDescription<T[K]>;
};

export type ValidationResult<T, K extends keyof T> = { valid: true } |
    ValidationSuccess<T, K> |
    ValidationFails<T, K>;


export type ValidationDescription<T> = {
    valid: boolean;
    message?: string;
    validation: { [K in keyof T]: ValidationResult<T, K> };
};
