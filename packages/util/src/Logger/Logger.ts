import * as os from "os";
import {fn} from "../function";
import {isDefined, isNumber, isUndefined} from "../is";
import {Perf} from "../Perf";
import {isLogable, isLoggerOwner} from "./functions";
import {
    ILogger,
    ILoggerTransport,
    Logable,
    LogableType,
    LogFn,
    LoggerOwner,
    LogMessage,
    SeverityLevel,
} from "./interfaces";

type SafeLog = (log: LogMessage) => void;

const pid = process.pid;
const host = os.hostname();
const writers: SafeLog[] = [];
const transports: ILoggerTransport[] = [];
const loggers = new WeakMap<LoggerOwner, Logger>();

export class Logger {
    protected static severity = SeverityLevel.INFO;
    protected static emergency = Logger.make(SeverityLevel.EMERGENCY);
    protected static alert = Logger.make(SeverityLevel.ALERT);
    protected static critical = Logger.make(SeverityLevel.CRITICAL);
    protected static error = Logger.make(SeverityLevel.ERROR);
    protected static warning = Logger.make(SeverityLevel.WARNING);
    protected static notice = Logger.make(SeverityLevel.NOTICE);
    protected static info = Logger.make(SeverityLevel.INFO);
    protected static debug = Logger.make(SeverityLevel.DEBUG);

    public readonly label: string;
    public groupId?: string;

    constructor(label: string, groupId?: string | number) {
        this.label = label;
        this.groupId = isNumber(groupId)
            ? groupId.toString()
            : groupId;
    }

    public get severity() {
        return Logger.severity;
    }

    public static setSeverity(severity: SeverityLevel) {
        this.severity = severity;
        const severities = [
            ["debug", SeverityLevel.DEBUG],
            ["info", SeverityLevel.INFO],
            ["notice", SeverityLevel.NOTICE],
            ["warning", SeverityLevel.WARNING],
            ["error", SeverityLevel.ERROR],
            ["critical", SeverityLevel.CRITICAL],
            ["alert", SeverityLevel.ALERT],
            ["emergency", SeverityLevel.EMERGENCY],
        ];

        for (const [severityFn, makeSeverity] of severities) {
            Reflect.set(this, severityFn, this.make(makeSeverity as SeverityLevel));
        }
    }

    public static add(transport: ILoggerTransport, unref = true) {
        transports.push(transport);
        const safeFn = fn.safe((log: LogMessage) => {
            if (transport.writable) {
                transport.write(log);
            }
        });

        writers.push(unref ? fn.isolate(safeFn) : safeFn);
    }

    public static set(list: ILoggerTransport[]) {
        this.reset();
        for (const item of list) {
            this.add(item);
        }
    }

    public static reset() {
        writers.splice(0, transports.length);
        transports.splice(0, transports.length);
    }

    public static factory(target: LoggerOwner) {
        return loggers.get(target) || this.createLogger(target);
    }

    protected static createLogger(target: LoggerOwner) {
        const label = target.constructor.name;
        if (isLoggerOwner(target)) {
            const logger = new this(target.getLogLabel?.() ?? label, target.getLogGroupId?.());
            loggers.set(target, logger);
            return logger;
        }

        const logger = new this(label);
        loggers.set(target, logger);
        return logger;
    }

    protected static write(logger: Logger, severity: SeverityLevel, message: string, ...args: LogableType[]) {
        const {label} = logger;
        const timestamp = Date.now();
        const log: LogMessage = {pid, host, label, severity, message, timestamp};

        if (severity < SeverityLevel.WARNING) {
            log.system = {
                freemem: os.freemem(),
                loadavg: os.loadavg(),
                arch: os.arch(),
                platform: os.platform(),
                cpus: os.cpus().length,
                version: process.version,
                uptime: os.uptime(),
            };
        }

        if (logger.groupId) {
            log.groupId = logger.groupId;
        }

        if (args.length > 0) {
            log.args = [];
            for (const arg of args) {
                if (isLogable(arg)) {
                    log.args.push(arg.getLogValue());
                    continue;
                }

                log.args.push(arg);
            }
        }

        writers.forEach((write) => write(log));
    }

    protected static make(severity: SeverityLevel) {
        if (severity > this.severity) {
            return () => void 0;
        }

        return (logger: Logger, message: string, ...args: LogableType[]) => {
            this.write(logger, severity, message, ...args);
        };
    }

    public add(child: ILogger) {
        if (child.logger === this || isDefined(child.logger.groupId) || isUndefined(this.groupId)) {
            return;
        }

        child.logger.groupId = this.groupId;
    }

    public perf(message: string, ...args: Logable[]) {
        if (this.severity < SeverityLevel.DEBUG) {
            return () => void 0;
        }

        const perf = new Perf(this.label, message);
        return () => {
            perf.finish();
            this.debug(perf.label, {perf, args});
        };
    }

    public emergency: LogFn = (...args) => Logger.emergency(this, ...args);

    public alert: LogFn = (...args) => Logger.alert(this, ...args);

    public critical: LogFn = (...args) => Logger.critical(this, ...args);

    public error: LogFn = (...args) => Logger.error(this, ...args);

    public warning: LogFn = (...args) => Logger.warning(this, ...args);

    public notice: LogFn = (...args) => Logger.notice(this, ...args);

    public info: LogFn = (...args) => Logger.info(this, ...args);

    public debug: LogFn = (...args) => Logger.debug(this, ...args);
}
