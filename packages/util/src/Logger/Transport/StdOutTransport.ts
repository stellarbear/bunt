import {LogMessage, SeverityLevel} from "../interfaces";
import {InOutTransportAbstract} from "./InOutTransportAbstract";

export class StdOutTransport extends InOutTransportAbstract {
    protected get stream() {
        return process.stdout;
    }

    protected test(log: LogMessage) {
        return log.severity >= SeverityLevel.NOTICE;
    }
}
