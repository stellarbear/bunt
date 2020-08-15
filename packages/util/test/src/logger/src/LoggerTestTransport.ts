import {ILoggerTransport, LogMessage} from "../../../../src";

export class LoggerTestTransport implements ILoggerTransport {
    public readonly writable = true;
    public readonly logs: LogMessage[];

    constructor(logs: LogMessage[]) {
        this.logs = logs;
    }

    public write(log: LogMessage): void {
        this.logs.push(log);
    }

    public close(): void {
        this.logs.length = 0;
    }
}
