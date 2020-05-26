import {LogMessage, SeverityLevel} from "../interfaces";
import {InOutTransportAbstract} from "./InOutTransportAbstract";

export class StdErrorTransport extends InOutTransportAbstract {
    protected get stream(): NodeJS.WritableStream {
        return process.stderr;
    }

    public close(): void {
        return;
    }

    protected test(log: LogMessage): boolean {
        return log.severity < SeverityLevel.NOTICE;
    }
}
