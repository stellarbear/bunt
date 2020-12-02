import {Disposable} from "@typesafeunit/unit";
import {assert, isDefined, isInstanceOf} from "@typesafeunit/util";
import {
    IMessageHandler,
    IQueueReader,
    IReadOperation,
    ISubscription,
    ISubscriptionResultHandler,
    ITransport,
    Message,
    MessageCtor,
    OperationReleaseState,
} from "./interfaces";
import {TaskAbstract} from "./Message";

export abstract class SubscriptionAbstract<M extends Message> implements ISubscription<M> {
    readonly #type: MessageCtor<M>;
    readonly #reader: IQueueReader<M>;
    readonly #transport: ITransport;
    readonly #handler: IMessageHandler<M>;
    readonly #watchers: ISubscriptionResultHandler<M>[] = [];

    #subscribed = true;
    #state?: Promise<void>;

    constructor(transport: ITransport, type: MessageCtor<M>, handler: IMessageHandler<M>) {
        this.#type = type;
        this.#reader = transport.reader(type);
        this.#handler = handler;
        this.#transport = transport;
        this.#state = this.listen();
    }

    public get subscribed(): boolean {
        return this.#subscribed;
    }

    public async subscribe(): Promise<void> {
        assert(!this.subscribed, `The ${this.#type.channel} channel already subscribed`);
        this.#subscribed = true;
        this.#state = this.listen();
    }

    public async unsubscribe(): Promise<void> {
        this.#subscribed = false;
        this.#reader.cancel();
        await this.#state;
    }

    public watch(fn: ISubscriptionResultHandler<M>): () => void {
        this.#watchers.push(fn);
        return () => {
            this.#watchers.splice(this.#watchers.indexOf(fn), 1);
        };
    }

    public dispose(): Disposable[] {
        return [
            () => this.unsubscribe(),
            () => {
                this.#watchers.splice(0, this.#watchers.length);
            },
            this.#reader,
        ];
    }

    protected async listen(): Promise<void> {
        while (this.#subscribed) {
            const readOperation = await this.#reader.read();
            if (readOperation) {
                await this.handle(readOperation);
            }
        }
    }

    protected async handle(operation: IReadOperation<M>): Promise<void> {
        const {message} = operation;
        try {
            const reply = await this.#handler(message);
            if (isDefined(reply) && isInstanceOf(message, TaskAbstract)) {
                await this.#transport.send(message.reply(reply));
            }

            await this.fire(operation.commit());
        } catch (error) {
            await this.fire(operation.rollback(error));
        }
    }

    private async fire(operation: Promise<OperationReleaseState<M>>) {
        const value = await operation;
        this.#watchers.forEach(async (fn) => fn(value));
    }
}
