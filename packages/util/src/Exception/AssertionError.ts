import {isFunction} from "../is";
import {ILogable} from "../Logger";

export class AssertionError extends Error implements ILogable<object> {
    public readonly details?: any;

    constructor(message?: string, details?: any) {
        super(message || "Assertion fails");

        this.details = isFunction(details)
            ? details()
            : details;
    }

    public getLogValue(): object {
        return {error: this.message, details: this.details};
    }
}
