import {LogMessage, SeverityLevel} from "../interfaces";
import {InOutTransportAbstract} from "./InOutTransportAbstract";

export class StdErrorTransport extends InOutTransportAbstract {
    protected get stream() {
        return process.stderr;
    }

    protected test(log: LogMessage) {
        return log.severity < SeverityLevel.NOTICE;
    }
}
