import {isFunction} from "@typesafeunit/util";
import {Promisify} from "./interfaces";

const DisposableSync = Symbol();
const Disposed = Symbol();

interface IDisposableSync {
    [DisposableSync]: true;
}

interface IDisposable {
    dispose(): Promisify<void>;
}

type DisposableFn = () => Promisify<void>;
type Disposable = DisposableFn
    | IDisposable
    | DisposableFn & IDisposableSync
    | IDisposable & IDisposableSync;

const Signals: NodeJS.Signals[] = ["SIGINT", "SIGQUIT", "SIGTERM"];

export class Runtime {
    protected readonly disposable: Disposable[] = [];
    private [Disposed] = false;

    public get disposed() {
        return this[Disposed];
    }

    public static async run(fn: (runtime: Runtime) => Promisify<void>) {
        const runtime = new this();

        // @TODO Send an event when a signal has been received.
        for (const signal of Signals) {
            process.on(signal, async () => {
                await runtime.dispose();
                process.exit();
            });
        }

        try {
            await fn(runtime);
        } finally {
            await runtime.dispose();
            process.exit();
        }
    }

    private on(event: "dispose", fn: Disposable): void;
    private on(event: "dispose:sync", fn: Disposable): void;
    private on(event: "dispose" | "dispose:sync", fn: Disposable): void {
        if (event === "dispose:sync") {
            Reflect.set(fn, DisposableSync, true);
        }

        this.disposable.push(fn);
    }

    private async dispose() {
        if (this.disposed) {
            return;
        }

        this[Disposed] = true;
        const filter = (disposer: Disposable) => DisposableSync in disposer;
        const disposableSync = this.disposable.filter(filter);
        const disposableAsync = this.disposable.filter((disposer) => !filter(disposer));
        for (const disposer of disposableSync) {
            await (isFunction(disposer) ? disposer() : disposer.dispose());
        }

        await Promise.all(disposableAsync.map((disposer) => isFunction(disposer) ? disposer() : disposer.dispose()));
    }
}
