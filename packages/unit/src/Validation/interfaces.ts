import {ValidationSchema} from "./ValidationSchema";

export type ValidationValue<T> = T extends Array<infer V> ? V : T;

export type ValidationFunction<T, K extends keyof T> = |
    ((value: T[K]) => void) | ValidationSchema<Exclude<ValidationValue<T[K]>, null | undefined>>;

export type ValidationAttributes = {
    required?: boolean;
    nullable?: boolean;
};

export type ValidatorArg<T, K extends keyof T> = ValidationFunction<T, K>
    | [ValidationFunction<T, K>, string]
    | ValidationAttributes & { validator: ValidationFunction<T, K>; message?: string };


export type ValidationSuccess<T, K extends keyof T> = {
    value: T[K];
    valid: true;
};

export type ValidationFails<T, K extends keyof T> = {
    value?: any;
    valid: false;
    message?: string;
    error?: Error;
    validation?: ValidationDescription<T[K]>;
};

export type ValidationDescription<T> = {
    valid: boolean;
    message?: string;
    validation: { [K in keyof T]: ValidationResult<T, K> };
};

export type ValidationResult<T, K extends keyof T> = { valid: true } |
    ValidationSuccess<T, K> |
    ValidationFails<T, K>;

export type ValidationSafeValue = {
    field: string;
    message?: string;
    input: any;
} | {
    field: string;
    validation?: ValidationSafeValue[];
};

export type ValidationSafeJSON = { error: string; validation: ValidationSafeValue[] };
