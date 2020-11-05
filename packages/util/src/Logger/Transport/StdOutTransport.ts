import {LogFormat, LogMessage, SeverityLevel} from "../interfaces";
import {defaultLogFormat} from "./formatters";
import {InOutTransportAbstract} from "./InOutTransportAbstract";

export class StdOutTransport extends InOutTransportAbstract<string> {
    constructor(format?: LogFormat<string>) {
        super(format ?? defaultLogFormat);
    }

    protected get stream(): NodeJS.WritableStream {
        return process.stdout;
    }

    public close(): void {
        return;
    }

    protected test(log: LogMessage): boolean {
        return log.severity >= SeverityLevel.NOTICE;
    }
}
