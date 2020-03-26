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

    public get beats() {
        return this.#beats;
    }

    public waitUntilStop() {
        return this.#defer;
    }
}
