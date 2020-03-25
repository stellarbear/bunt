import {isFunction} from "@typesafeunit/util";
import {Promisify} from "./interfaces";
import {Disposable} from "./Runtime/interfaces";
import {DisposableSync, Disposed, Signals} from "./Runtime/symbols";

const RuntimeRef = Symbol();

export class Runtime {
    private static readonly [RuntimeRef] = new Runtime();
    protected readonly disposable: Disposable[] = [];
    private readonly created: Date;
    private [Disposed] = false;

    private constructor() {
        this.created = new Date();
    }

    public static get runtime() {
        return this[RuntimeRef];
    }

    public get online() {
        return !this[Disposed];
    }

    public static run(fn: (runtime: Runtime) => Promisify<void>) {
        return this.runtime.run(fn);
    }

    public async run(fn: (runtime: Runtime) => Promisify<void>) {
        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
            process.on(signal, async () => await this.shutdown());
        }

        try {
            await fn(this);
        } finally {
            await this.shutdown();
        }
    }

    public on(event: "dispose", fn: Disposable): void;
    public on(event: "dispose:sync", fn: Disposable): void;
    public on(event: "dispose" | "dispose:sync", fn: Disposable): void {
        if (event === "dispose:sync") {
            Reflect.set(fn, DisposableSync, true);
        }

        this.disposable.push(fn);
    }

    private async shutdown() {
        await this.dispose();
        this[Disposed] = true;
        process.exit();
    }

    private async dispose() {
        if (!this.online) {
            return;
        }

        const filter = (disposer: Disposable) => DisposableSync in disposer;
        const disposableSync = this.disposable.filter(filter);
        const disposableAsync = this.disposable.filter((disposer) => !filter(disposer));
        for (const disposer of disposableSync) {
            await (isFunction(disposer) ? disposer() : disposer.dispose());
        }

        await Promise.all(disposableAsync.map((disposer) => isFunction(disposer) ? disposer() : disposer.dispose()));
    }
}
