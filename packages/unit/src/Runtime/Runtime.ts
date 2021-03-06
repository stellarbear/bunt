import {assert, isNull, isUndefined, Logger, Promisify} from "@bunt/util";
import {Disposer} from "./Disposer";
import {Heartbeat} from "./Heartbeat";
import {Disposable, DisposableFn, IRunnable} from "./interfaces";
import {isDisposable, isRunnable, Signals} from "./internal";

const RuntimeRef = Symbol();
const DEBUG = !!process.env.DEBUG;
const ENV = process.env.NODE_ENV || "production";

export class Runtime {
    private static [RuntimeRef]: Runtime;

    public readonly logger: Logger;

    protected readonly queue: Heartbeat[] = [];
    protected readonly disposable: Disposable[] = [];
    private readonly created: Date;
    #disposed = false;

    private constructor() {
        this.logger = Logger.factory(this);
        this.created = new Date();
        this.logger.info("register", {ENV, DEBUG});
        this.accept(this.logger);
        this.accept(() => new Promise((resolve) => process.nextTick(resolve)));

        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
            this.logger.debug("listen", signal);
            process.on(signal, async () => this.online && this.release());
        }
    }

    public static get runtime(): Runtime {
        return this[RuntimeRef];
    }

    public get online(): boolean {
        return !this.#disposed;
    }

    public static on(event: "release", callback: DisposableFn): void {
        this.runtime.disposable.push(callback);
    }

    public static isDebugEnable(): boolean {
        return DEBUG;
    }

    public static isProduction(): boolean {
        return ENV === "production";
    }

    public static isDevelopment(): boolean {
        return ENV !== "production";
    }

    public static isTest(): boolean {
        return ENV === "test";
    }

    public static initialize(before?: () => any): void {
        if (this[RuntimeRef]) {
            return;
        }

        try {
            before && before();
        } finally {
            this[RuntimeRef] = new this();
        }
    }

    public static run(fn: (runtime: Runtime) => Promisify<void | IRunnable>): Promise<void> {
        this.initialize();
        return this.runtime.run(fn);
    }

    public async run(fn: (runtime: Runtime) => Promisify<void | IRunnable>): Promise<void> {
        const finish = this.logger.perf("run");
        try {
            this.accept(await fn(this));
            await Promise.allSettled(this.queue.map((hb) => hb.waitUntilStop()));
        } catch (error) {
            this.logger.emergency(error.message, error.stack);
        } finally {
            finish();
        }

        if (this.online) {
            process.nextTick(() => this.release());
        }
    }

    public accept(item: unknown): void {
        if (isUndefined(item) || isNull(item)) {
            return;
        }

        if (isDisposable(item)) {
            this.disposable.push(item);
        }

        if (isRunnable(item)) {
            this.queue.push(item.getHeartbeat());
        }
    }

    private async release(): Promise<void> {
        this.logger.info("release");
        assert(this.online, "Runtime has been already released");
        this.#disposed = true;

        await Disposer.dispose(this.disposable);
        process.exit();
    }
}
