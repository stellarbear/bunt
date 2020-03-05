import {ValidationDescription} from "./interfaces";

export class ValidationError<T> extends Error {
    public readonly description: ValidationDescription<T>;

    constructor(message: string, description: ValidationDescription<T>) {
        super(message);
        this.description = description;
    }
}
