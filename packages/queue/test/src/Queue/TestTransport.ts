import {AsyncState} from "@bunt/util";
import {
    IQueueReader,
    IReadOperation,
    ISubscription,
    ITransport,
    Message,
    MessageCtor,
    MessageHandler,
    ReadOperation,
} from "../../../src";
import {Subscription} from "../../../src/Queue/Subscription";

export class TestTransport implements ITransport {
    public readonly pending: Promise<void>[] = [];
    readonly #messages = new Map<string, Message[]>();

    public subscribe<M extends Message>(type: MessageCtor<M>, handler: MessageHandler<M>): ISubscription<M> {
        return new Subscription(this, type, handler);
    }

    public reader<M extends Message>(type: MessageCtor<M>): IQueueReader<M> {
        const queue = this.ensure<M>(type.channel);
        const cancel = () => this.resolve();
        const listenNext = () => {
            const state = AsyncState.acquire();
            this.pending.push(state);
            return state;
        };

        return {
            channel: type.channel,
            async read(): Promise<IReadOperation<M> | undefined> {
                const message = queue.shift();
                if (message) {
                    return new ReadOperation(message);
                }

                await listenNext();
            },
            async cancel(): Promise<void> {
                cancel();
            },
            dispose(): void {
                // skip
            },
        };
    }

    public send<M extends Message>(message: M): void {
        const queue = this.ensure(message.channel);

        queue.push(message);
        this.resolve();
    }

    public async dispose(): Promise<void> {
        await this.resolve();
    }

    private ensure<M extends Message>(channel: string) {
        const queue = this.#messages.get(channel) ?? [];
        if (!this.#messages.has(channel)) {
            this.#messages.set(channel, queue);
        }

        return queue as M[];
    }

    private resolve() {
        while (this.pending.length > 0) {
            AsyncState.resolve(this.pending.shift());
        }
    }
}
