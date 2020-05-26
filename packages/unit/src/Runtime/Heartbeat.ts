export class Heartbeat<T = unknown> {
    #beats = true;
    readonly #defer: Promise<T | Error>;

    constructor(executor: (resolve: (value: Error | T) => void) => void) {
        this.#defer = new Promise((resolve) => {
            executor((error) => {
                this.#beats = false;
                resolve(error);
            });
        });
    }

    public get beats(): boolean {
        return this.#beats;
    }

    public waitUntilStop(): Promise<T | Error> {
        return this.#defer;
    }
}
