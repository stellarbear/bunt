import {bind} from "../decorator";
import {isUndefined} from "../is";

export type ReturnCallback<T> = (value: T) => void;

export class AsyncCallback<T> implements AsyncIterable<T> {
    readonly #disposables: { (): void }[] = [];
    readonly #pipeline: ReturnCallback<T | undefined>[] = [];
    readonly #queue: T[] = [];

    constructor(link: (emit: ReturnCallback<T>) => () => void) {
        this.#disposables.push(link(this.push), this.pipe);
    }

    @bind
    public push(value: T): void {
        if (this.#pipeline.length) {
            return this.pipe(value);
        }

        this.#queue.push(value);
    }

    @bind
    public pull(): Promise<T | undefined> {
        const value = this.#queue.shift();
        if (value) {
            return Promise.resolve(value);
        }

        return new Promise<T | undefined>(this.sync);
    }

    public [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
            next: async (): Promise<IteratorResult<T>> => {
                return this.pull().then(this.asResult);
            },
            return: async (value?: T | PromiseLike<T>): Promise<IteratorResult<T>> => {
                this.dispose();
                return Promise.resolve(value)
                    .then(this.asResult);
            },
            throw: async (e?): Promise<IteratorResult<T>> => {
                this.dispose();
                return Promise.reject(e);
            },
        };
    }

    private dispose(): void {
        this.#disposables.forEach((fn) => fn());
    }

    @bind
    private asResult(value?: T): IteratorResult<T> {
        return isUndefined(value) ? {value, done: true} : {value, done: false};
    }

    @bind
    private pipe(value?: T) {
        this.#pipeline.splice(0, this.#pipeline.length)
            .forEach((resolve) => resolve(value));
    }

    @bind
    private sync(resolve: (data?: T) => void): void {
        const value = this.#queue.shift();
        if (value) {
            return resolve(value);
        }

        this.#pipeline.push(resolve);
    }
}
