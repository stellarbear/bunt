import {isArray, isFunction, isVoid} from "@bunt/util";
import {Disposable} from "./interfaces";
import {DisposableSync} from "./internal";

interface IDisposed {
    error?: Error;
    timeout: number;
    target: string;
    date: Date;
}

export class Disposer {
    public static async dispose(disposable?: Disposable[] | Disposable | void): Promise<IDisposed[]> {
        if (isVoid(disposable)) {
            return [];
        }

        if (!isArray(disposable)) {
            return this.dispose([disposable]);
        }

        const disposed: IDisposed[] = [];
        for (const disposableSync of this.getDisposableSync(disposable)) {
            await this.run(disposableSync, disposed);
        }

        const disposableAsync = this.getDisposableAsync(disposable);
        await Promise.allSettled(disposableAsync.map((item) => this.run(item, disposed)));

        return disposed;
    }

    private static async run(disposable: Disposable, disposed: IDisposed[]): Promise<void> {
        const date = new Date();
        const target = disposable.constructor.name;
        try {
            const disposableExecution = isFunction(disposable)
                ? disposable()
                : disposable.dispose();

            disposed.push(...await this.dispose(await disposableExecution));
            disposed.push({target, date, timeout: Date.now() - date.getTime()});
        } catch (error) {
            disposed.push({target, error, date, timeout: Date.now() - date.getTime()});
        }
    }

    private static getDisposableSync(disposableList: Disposable[]): Disposable[] {
        return disposableList.filter(this.isDisposableSync);
    }

    private static getDisposableAsync(disposableList: Disposable[]): Disposable[] {
        return disposableList.filter((disposable) => !this.isDisposableSync(disposable));
    }

    private static isDisposableSync(disposable: Disposable): disposable is Disposable {
        return DisposableSync in disposable;
    }
}
