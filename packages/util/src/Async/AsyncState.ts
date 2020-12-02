export interface IAsyncStateMap<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (error?: Error) => void;
    done: boolean;
}

const registry = new WeakMap<Promise<any>, IAsyncStateMap<any>>();

export class AsyncState {
    public static acquire<T = void>(): Promise<T> {
        const state = {};
        const pending = new Promise<T>((resolve, reject) => {
            Object.assign(state, {resolve, reject, done: false});
        });

        registry.set(pending, state as IAsyncStateMap<T>);

        return pending;
    }

    public static resolve<T extends void>(pending: Promise<T> | undefined, value?: T): void;
    public static resolve<T>(pending: Promise<T> | undefined, value: T): void {
        if (pending) {
            const state = registry.get(pending);
            if (state && !this.isReleased(pending)) {
                state.resolve(value);
                state.done = true;
            }
        }
    }

    public static reject<T>(pending: Promise<T> | undefined, reason?: Error): void {
        if (pending) {
            const state = registry.get(pending);
            if (state && !this.isReleased(pending)) {
                state.reject(reason);
                state.done = true;
            }
        }
    }

    public static isReleased<T>(pending: Promise<T> | undefined): boolean {
        return !pending || (registry.get(pending)?.done ?? true);
    }
}
