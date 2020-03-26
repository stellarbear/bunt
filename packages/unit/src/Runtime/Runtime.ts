import {assert, isFunction} from "@typesafeunit/util";
import {Promisify} from "../interfaces";
import {Heartbeat} from "./Heartbeat";
import {Disposable, IRunnable} from "./interfaces";
import {DisposableSync, isDisposable, isRunnable, Signals} from "./internal";

const RuntimeRef = Symbol();

export class Runtime {
    private static readonly [RuntimeRef] = new Runtime();
    protected readonly queue: Heartbeat[] = [];
    protected readonly disposable: Disposable[] = [];
    private readonly created: Date;
    #disposed = false;

    private constructor() {
        this.created = new Date();

        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
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
        try {
            this.accept(await fn(this));
            await Promise.allSettled(this.queue.map((hb) => hb.waitUntilStop()));
        } finally {
            if (this.online) {
                await this.release();
            }
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
