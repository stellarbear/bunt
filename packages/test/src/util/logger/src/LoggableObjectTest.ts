import {ILogable, ILogger, LogableType, Logger, logger} from "@typesafeunit/util";

export class LoggableObjectTest<T extends LogableType> implements ILogger, ILogable<T> {
    @logger
    public logger!: Logger;

    protected value: T;

    constructor(value: T) {
        this.value = value;
    }

    public getLogValue = () => this.value;

    public getLogLabel = () => "LoggableObjectTest:#1";
}
