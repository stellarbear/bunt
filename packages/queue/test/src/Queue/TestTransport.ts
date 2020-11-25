import {IChannel, ITransaction, ITransport, Message, MessageCtor} from "../../../src";
import {TestTransaction} from "./TestTransaction";

export class TestTransport implements ITransport {
    public readonly pending: (() => void)[] = [];
    readonly #messages = new Map<string, Message[]>();
    #ready = false;

    channel<M extends Message>(type: MessageCtor<M>): IChannel<M> {
        const generator = this.subscribe(type);
        return {
            type,
            subscribed: true,
            subscribe(): AsyncGenerator<ITransaction<M>> {
                return generator;
            },
            unsubscribe: () => {
                this.#ready = false;
                this.pending.forEach((resolve) => resolve());
            },
        };
    }

    public async* subscribe<M extends Message>(type: MessageCtor<M>): AsyncGenerator<TestTransaction<M>> {
        const listenNext = () => new Promise<void>((resolve) => this.pending.push(resolve));
        const queue = this.ensure<M>(type.channel);
        this.#ready = true;

        while (this.#ready) {
            if (queue.length > 0) {
                const message = queue.shift();
                if (message) {
                    yield new TestTransaction(message);
                }

                continue;
            }

            await listenNext();
        }
    }

    public send<M extends Message>(message: M): void {
        const queue = this.ensure(message.channel);

        queue.push(message);
        while (this.pending.length > 0) {
            const resolve = this.pending.shift();
            if (resolve) {
                resolve();
            }
        }
    }

    private ensure<M extends Message>(channel: string) {
        const queue = this.#messages.get(channel) ?? [];
        if (!this.#messages.has(channel)) {
            this.#messages.set(channel, queue);
        }

        return queue as M[];
    }
}
