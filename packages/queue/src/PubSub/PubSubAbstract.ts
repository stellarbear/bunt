import {Disposable, IDisposable} from "@bunt/unit";
import {AsyncCallback, Fn, isArray, Promisify} from "@bunt/util";
import {IPubSubTransport, ISubscriber, PubSubChannel} from "./interfaces";

export abstract class PubSubAbstract<S extends Record<string, any>, T extends IPubSubTransport>
    implements IDisposable {
    readonly #transport: T;
    readonly #subscriptions = new Map<string, ISubscriber>();
    readonly #iterables = new Set<AsyncCallback<any>>();

    public constructor(transport: T) {
        this.#transport = transport;
    }

    public async publish<K extends keyof S>(channel: PubSubChannel<K>, message: S[K]): Promise<void> {
        await this.#transport.publish(this.key(channel), this.serialize(message));
    }

    public async subscribe<K extends keyof S>(channel: PubSubChannel<string>): Promise<AsyncIterable<S[K]>>;
    public async subscribe<K extends keyof S>(channel: PubSubChannel<string>,
                                              listener: Fn<[S[K]], unknown>): Promise<() => void>;
    public async subscribe<K extends keyof S>(
        channel: PubSubChannel<string>, listener?: Fn<[S[K]], unknown>): Promise<AsyncIterable<S[K]> | (() => void)> {
        const key = this.key(channel);
        const subscription = this.#subscriptions.get(key) ?? await this.#transport.subscribe(key);
        if (!this.#subscriptions.has(key)) {
            await subscription.subscribe();
            this.#subscriptions.set(key, subscription);
        }

        if (listener) {
            return subscription.listen((message) => listener(this.parse(message)));
        }

        const iterable = new AsyncCallback<S[K]>((emit) => {
            return subscription.listen((message) => emit(this.parse(message)));
        });

        this.#iterables.add(iterable);
        return iterable;
    }

    public async asyncIterator<K extends keyof S>(channel: Extract<K, string>): Promise<AsyncIterator<S[K]>> {
        const subscription = await this.subscribe(channel);
        return subscription[Symbol.asyncIterator]() as AsyncIterator<S[K]>;
    }

    public dispose(): Promisify<Disposable | Disposable[] | void> {
        for (const iterable of this.#iterables.values()) {
            iterable.dispose();
        }

        return this.#transport.dispose();
    }

    protected key(channel: PubSubChannel<string>): string {
        return isArray(channel) ? channel.join("/") : channel;
    }

    protected abstract serialize<K extends keyof S>(message: S[K]): string;

    protected abstract parse<K extends keyof S>(message: string): S[K];
}
