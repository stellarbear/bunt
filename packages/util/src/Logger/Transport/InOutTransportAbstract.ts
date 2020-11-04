import {Promisify} from "../../interfaces";
import {ILoggerTransport, LogFormat, LogMessage} from "../interfaces";
import {defaultLogFormat} from "./formatters";

export interface ILoggerStreamCallback {
    write(log: string, encoding?: string): void;
    writable: boolean;
}

export type LoggerWritableStream = ILoggerStreamCallback;

export abstract class InOutTransportAbstract implements ILoggerTransport {
    protected abstract readonly stream: LoggerWritableStream;

    readonly #format: LogFormat;

    constructor(formatter?: LogFormat) {
        this.#format = formatter || defaultLogFormat;
    }

    public get writable(): boolean {
        return this.stream.writable;
    }

    public write(log: LogMessage): void {
        if (this.test(log)) {
            this.stream.write(
                this.#format(log) + "\n",
                "utf-8",
            );
        }
    }

    public abstract close(): Promisify<void>;

    protected abstract test(log: LogMessage): boolean;
}
