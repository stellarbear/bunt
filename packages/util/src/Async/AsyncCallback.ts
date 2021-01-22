import {bind} from "../decorator";
import {Fn} from "../interfaces";
import {isUndefined} from "../is";

export class AsyncCallback<T> implements AsyncIterable<T> {
    readonly #disposables: Fn[] = [];
    readonly #pipeline: Fn<[T | undefined]>[] = [];
    readonly #queue: T[] = [];

    constructor(link: (emit: Fn<[data: T]>) => () => void) {
        this.#disposables.push(link(this.push), this.pipe);
    }

    @bind
    public push(value: T): void {
        console.log("push", value);
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
                return this.pull()
                    .then(this.asResult);
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

    public dispose(): void {
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
    private sync(resolve: Fn<[T?]>): void {
        const value = this.#queue.shift();
        if (value) {
            return resolve(value);
        }

        this.#pipeline.push(resolve);
    }
}
