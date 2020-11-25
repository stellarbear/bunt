import {assert} from "@typesafeunit/util";
import {HandleResult, IChannel, IMessageHandler, ISubscription} from "./interfaces";
import {MessageAbstract} from "./MessageAbstract";

export class Subscription<M extends MessageAbstract<any>> implements ISubscription<M> {
    readonly #channel: IChannel<M>;
    readonly #handler: IMessageHandler<M>;
    readonly #state: Promise<void>;
    readonly #listeners: ((result: HandleResult<M>) => unknown)[] = [];

    constructor(channel: IChannel<M>, handler: IMessageHandler<M>) {
        this.#channel = channel;
        this.#handler = handler;
        this.#state = this.run();
    }

    public async run(): Promise<void> {
        for await (const transaction of this.#channel.subscribe()) {
            try {
                const {message} = transaction;
                await this.#handler(message);
                this.logResult(transaction.commit());
            } catch (error) {
                this.logResult(transaction.rollback(error));
            }
        }
    }

    public async unsubscribe(): Promise<void> {
        assert(this.#channel.subscribed, "Already unsubscribed");
        await this.#channel.unsubscribe();
        await this.#state;
    }

    public listenResult(fn: (result: HandleResult<M>) => unknown): () => void {
        this.#listeners.push(fn);
        return () => {
            this.#listeners.splice(this.#listeners.indexOf(fn), 1);
        };
    }

    private async logResult(pending: Promise<HandleResult<M>>) {
        const result = await pending;
        this.#listeners.forEach((fn) => fn(result));
    }
}
