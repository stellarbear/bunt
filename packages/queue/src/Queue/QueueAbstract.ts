import {IDisposable} from "@bunt/unit";
import {ISubscription, ITransport, Message, MessageCtor, MessageHandler, Task} from "./interfaces";

export abstract class QueueAbstract<Q extends ITransport> implements IDisposable {
    readonly #transport: Q;

    constructor(transport: Q) {
        this.#transport = transport;
    }

    public async send<M extends Message>(message: M): Promise<void> {
        await this.#transport.send(message);
    }

    public subscribe<M extends Message | Task>(type: MessageCtor<M>, handler: MessageHandler<M>): ISubscription<M> {
        return this.#transport.subscribe(type, handler);
    }

    public async dispose(): Promise<IDisposable> {
        return this.#transport;
    }
}
