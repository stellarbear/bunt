import {ILoggerTransport, LogMessage} from "../interfaces";

export abstract class InOutTransportAbstract implements ILoggerTransport {
    protected abstract readonly stream: NodeJS.WritableStream;

    public get writable() {
        return this.stream.writable;
    }

    public write(log: LogMessage) {
        if (this.test(log)) {
            this.stream.write(
                JSON.stringify(log, null, 2) + "\n",
                "utf-8",
            );
        }
    }

    protected abstract test(log: LogMessage): boolean;
}
