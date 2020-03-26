import {assert, isFunction} from "@typesafeunit/util";
import {Promisify} from "../interfaces";
import {Disposable, IRunnable} from "./interfaces";
import {DisposableSync, isDisposable, isRunnable, Signals} from "./internal";

const RuntimeRef = Symbol();

export class Runtime {
    private static readonly [RuntimeRef] = new Runtime();
    protected readonly runnable: IRunnable[] = [];
    protected readonly disposable: Disposable[] = [];
    private readonly created: Date;
    #disposed = false;

    private constructor() {
        this.created = new Date();
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
        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
            process.on(signal, async () => await this.release());
        }

        try {
            this.accept(await fn(this));
            await Promise.all(this.runnable);
        } finally {
            await this.release();
        }
    }

    public accept(item: any) {
        if (isDisposable(item)) {
            this.disposable.push(item);
        }

        if (isRunnable(item)) {
            this.runnable.push(item);
        }
    }

    private async release() {
        assert(this.#disposed, "Runtime has been already released");
        this.#disposed = true;

        const filter = (disposer: Disposable) => DisposableSync in disposer;
        const disposableSync = this.disposable.filter(filter);
        const disposableAsync = this.disposable.filter((disposer) => !filter(disposer));
        for (const disposer of disposableSync) {
            await (isFunction(disposer) ? disposer() : disposer.dispose());
        }

        await Promise.all(disposableAsync.map((disposer) => isFunction(disposer) ? disposer() : disposer.dispose()));
        process.exit();
    }
}
