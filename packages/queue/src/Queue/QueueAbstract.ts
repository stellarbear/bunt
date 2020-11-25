import {IMessageHandler, ITransport, Message, MessageCtor} from "./interfaces";
import {Subscription} from "./Subscription";

export class QueueAbstract<Q extends ITransport> {
    readonly #transport: Q;

    constructor(transport: Q) {
        this.#transport = transport;
    }

    public get transport(): Q {
        return this.#transport;
    }

    public async emit<M extends Message>(message: M): Promise<void> {
        await this.#transport.send(message);
    }

    public subscribe<M extends Message>(type: MessageCtor<M>,
                                        handler: IMessageHandler<M>): Subscription<M> {
        return new Subscription<M>(this.#transport.channel(type), handler);
    }
}
