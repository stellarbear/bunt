import {ILoggerTransport, LogMessage} from "@typesafeunit/util";

export class LoggerTestTransport implements ILoggerTransport {
    public readonly writable = true;
    public readonly logs: LogMessage[];

    constructor(logs: LogMessage[]) {
        this.logs = logs;
    }

    public write(log: LogMessage) {
        this.logs.push(log);
    }
}
