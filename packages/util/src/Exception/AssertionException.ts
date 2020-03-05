import {isFunction} from "../is";

export class AssertionException extends Error {
    public readonly details?: any;

    constructor(message?: string, details?: any) {
        super(message || "Assertion fails");
        if (isFunction(details)) {
            this.details = details();
        }

        this.details = details;
    }
}
