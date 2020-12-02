const of = new WeakMap<any, Heartbeat<any>>();

export type HeartbeatExecutor<T> = (resolve: (value: Error | T) => void) => void;

export class Heartbeat<T = unknown> {
    #beats = true;
    readonly #defer: Promise<T | Error>;

    constructor(executor: HeartbeatExecutor<T>) {
        this.#defer = new Promise((resolve) => {
            executor((error) => {
                this.#beats = false;
                resolve(error);
            });
        });
    }

    public static of<T = unknown>(target: unknown, executor: HeartbeatExecutor<T>): Heartbeat<T> {
        const heartbeat = of.get(target) ?? new Heartbeat<any>(executor);
        if (!of.has(target)) {
            of.set(target, heartbeat);
        }

        return heartbeat;
    }

    public get beats(): boolean {
        return this.#beats;
    }

    public waitUntilStop(): Promise<T | Error> {
        return this.#defer;
    }
}
