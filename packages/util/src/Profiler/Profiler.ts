import {EventEmitter} from "events";
import {isFunction} from "../is";
import {ProfileEvent, ProfileFireArgs, ProfilerConfig} from "./interfaces";

export class Profiler<T extends ProfilerConfig> {
    protected readonly dispatcher = new EventEmitter();
    protected readonly config: T;
    protected allow: boolean;

    constructor(config: T) {
        this.config = config;
        this.allow = false;
    }

    public static create<T extends ProfilerConfig>(config: T) {
        return new this(config);
    }

    public enable() {
        this.allow = true;
        return this;
    }

    public disable() {
        this.allow = false;
        return this;
    }

    public fire<K extends keyof T>(type: K, ...[payloadArg]: ProfileFireArgs<T, K>) {
        if (this.allow) {
            const transform = this.config[type];
            const payload = isFunction(payloadArg) ? payloadArg() : payloadArg;

            this.dispatch<K>(
                type,
                {
                    type,
                    payload: isFunction(transform) ? transform(payload) : payload,
                },
            );
        }

        return this;
    }

    public listen(fn: (type: keyof T, data: object) => void): this;
    public listen<K extends keyof T>(type: K, fn: (data: ProfileEvent<T, K>) => void): this;
    public listen<K extends keyof T>(...args: any[]) {
        if (args.length === 1) {
            const [fn] = args;
            this.dispatcher.on("*", fn);
        }

        if (args.length === 2) {
            const [type, fn] = args;
            this.dispatcher.on(type as string, fn);
        }

        return this;
    }

    protected dispatch<K extends keyof T>(type: K, data: ProfileEvent<T, K>) {
        this.dispatcher.emit(type as string, data);
        this.dispatcher.emit("*", type, data);
        return this;
    }
}
