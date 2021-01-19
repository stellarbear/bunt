import {bind} from "../decorator";
import {isUndefined} from "../is";

export type ReturnCallback<T> = (value: T) => void;

export class AsyncCallback<T> implements AsyncIterable<T> {
    readonly #disposables: { (): void }[] = [];
    readonly #pipeline: ReturnCallback<T | undefined>[] = [];
    readonly #queue: T[] = [];

    constructor(link: (emit: ReturnCallback<T>) => () => void) {
        this.#disposables.push(link(this.push), this.resolve);
    }

    @bind
    public push(value: T): void {
        if (this.#pipeline.length) {
            return this.resolve(value);
        }

        this.#queue.push(value);
    }

    @bind
    public pull(): Promise<T | undefined> {
        const value = this.#queue.shift();
        if (value) {
            return Promise.resolve(value);
        }

        return new Promise<T | undefined>((resolve) => this.#pipeline.push(resolve));
    }

    public [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
            next: async (): Promise<IteratorResult<T>> => {
                return this.getIteratorResult();
            },
            return: async (value?: T | PromiseLike<T>): Promise<IteratorResult<T>> => {
                this.dispose();
                return Promise.resolve(value)
                    .then(this.valueToIteratorResult);
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

    private getIteratorResult(): Promise<IteratorResult<T>> {
        return this.pull().then(this.valueToIteratorResult);
    }

    @bind
    private valueToIteratorResult(value?: T): IteratorResult<T> {
        return isUndefined(value) ? {value, done: true} : {value, done: false};
    }

    @bind
    private resolve(value?: T) {
        this.#pipeline.splice(0, this.#pipeline.length)
            .forEach((resolve) => resolve(value));
    }
}
