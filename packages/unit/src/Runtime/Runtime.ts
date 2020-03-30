import {assert, isFunction, Logger} from "@typesafeunit/util";
import {Promisify} from "../interfaces";
import {Heartbeat} from "./Heartbeat";
import {Disposable, IRunnable} from "./interfaces";
import {DisposableSync, isDisposable, isRunnable, Signals} from "./internal";

const RuntimeRef = Symbol();

export class Runtime {
    private static readonly [RuntimeRef] = new Runtime();

    public readonly logger: Logger;

    protected readonly queue: Heartbeat[] = [];
    protected readonly disposable: Disposable[] = [];
    private readonly created: Date;
    #disposed = false;

    private constructor() {
        this.logger = Logger.factory(this);
        this.created = new Date();
        this.logger.info("created");

        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
            this.logger.debug("listen", signal);
            process.on(signal, async () => this.online && this.release());
        }
    }

    public static get runtime() {
        return this[RuntimeRef];
    }

    public get online() {
        return !this.#disposed;
    }

    public static run(fn: (runtime: Runtime) => Promisify<void | IRunnable>) {
        return this.runtime.run(fn);
    }

    public async run(fn: (runtime: Runtime) => Promisify<void | IRunnable>) {
        const finish = this.logger.perf("run");
        try {
            this.accept(await fn(this));
            await Promise.allSettled(this.queue.map((hb) => hb.waitUntilStop()));
        } catch (error) {
            this.logger.emergency(error.message, error.stack);
        } finally {
            this.logger.info("finish");
            if (this.online) {
                await this.release();
            }

            finish();
        }
    }

    public accept(item: any) {
        if (isDisposable(item)) {
            this.disposable.push(item);
        }

        if (isRunnable(item)) {
            this.queue.push(item.getHeartbeat());
        }
    }

    private async release() {
        this.logger.info("release");
        assert(this.online, "Runtime has been already released");
        this.#disposed = true;

        const filter = (disposer: Disposable) => DisposableSync in disposer;
        const dispose = (disposer: Disposable) => isFunction(disposer) ? disposer() : disposer.dispose();
        const disposableSync = this.disposable.filter(filter);
        const disposableAsync = this.disposable.filter((disposer) => !filter(disposer));
        for (const disposer of disposableSync) {
            try {
                await dispose(disposer);
            } finally {}
        }

        await Promise.allSettled(disposableAsync.map(dispose));
        process.exit();
    }
}
