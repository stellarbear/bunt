import {Disposable, IDisposable} from "@bunt/unit";
import {AsyncCallback, Fn, Promisify} from "@bunt/util";
import {IPubSubTransport, ISubscriber} from "./interfaces";

export abstract class PubSubAbstract<S extends Record<string, any>, T extends IPubSubTransport>
    implements IDisposable {
    readonly #transport: T;
    readonly #subscriptions = new Map<string, ISubscriber>();
    readonly #iterables = new Set<AsyncCallback<any>>();

    public constructor(transport: T) {
        this.#transport = transport;
    }

    public async publish<K extends keyof S>(channel: Extract<K, string>, message: S[K]): Promise<void> {
        await this.#transport.publish(channel, this.serialize(message));
    }

    public async subscribe<K extends keyof S>(channel: Extract<K, string>): Promise<AsyncIterable<S[K]>>;
    public async subscribe<K extends keyof S>(channel: Extract<K, string>,
                                              listener: Fn<[S[K]], unknown>): Promise<() => void>;
    public async subscribe<K extends keyof S>(
        channel: Extract<K, string>, listener?: Fn<[S[K]], unknown>): Promise<AsyncIterable<S[K]> | (() => void)> {
        const subscription = this.#subscriptions.get(channel) ?? await this.#transport.subscribe(channel);
        if (!this.#subscriptions.has(channel)) {
            await subscription.subscribe();
            this.#subscriptions.set(channel, subscription);
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

    public dispose(): Promisify<Disposable | Disposable[] | void> {
        for (const iterable of this.#iterables.values()) {
            iterable.dispose();
        }

        return this.#transport.dispose();
    }

    protected abstract serialize<K extends keyof S>(message: S[K]): string;

    protected abstract parse<K extends keyof S>(message: string): S[K];
}
