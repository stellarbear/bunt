import {isFunction} from "../is";

export class AssertionException extends Error {
    public readonly details?: any;

    constructor(message?: string, details?: any) {
        super(message || "Assertion fails");

        this.details = isFunction(details)
            ? details()
            : details;
    }
}
