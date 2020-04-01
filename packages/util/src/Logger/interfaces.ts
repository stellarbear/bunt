import {Promisify} from "../interfaces";
import {Logger} from "./Logger";

export enum SeverityLevel {
    EMERGENCY,
    ALERT,
    CRITICAL,
    ERROR,
    WARNING,
    NOTICE,
    INFO,
    DEBUG,
}

export interface ILoggerTransport {
    readonly writable: boolean;

    write(log: LogMessage): Promisify<void>;
    close(): Promisify<void>;
}

export interface ILogger {
    readonly logger: Logger;

    getLogLabel?(): string;

    getLogGroupId?(): string | number;
}

export type LoggerOwner = object | ILogger | Function;
export type LogableType = string
    | object
    | number
    | bigint
    | null
    | undefined
    | boolean
    | Date;

export interface ILogable<T extends LogableType> {
    getLogValue(): T;
}

export type Logable = ILogable<LogableType> | LogableType | Logable[];

export type LogFn = (message: string, ...args: Logable[]) => void;
export type LogFormat = (log: LogMessage) => string;

export type LogSystemInfo = {
    arch: string;
    platform: string;
    freemem: number;
    loadavg: number[];
    uptime: number;
    version: string;
    cpus: number;
};

export type LogMessage = {
    pid: number;
    host: string;
    label: string;
    timestamp: number;
    severity: SeverityLevel;
    message: string;
    groupId?: string;
    args?: LogableType[];
    system?: LogSystemInfo;
};
