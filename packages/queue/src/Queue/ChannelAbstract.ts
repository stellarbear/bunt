import {IChannel, ITransaction, Message, MessageCtor} from "./interfaces";

export abstract class ChannelAbstract<M extends Message> implements IChannel<M> {
    public abstract readonly subscribed: boolean;

    public readonly type: MessageCtor<M>;

    constructor(type: MessageCtor<M>) {
        this.type = type;
    }

    public get key(): string {
        return this.type.channel;
    }

    public abstract subscribe(): AsyncGenerator<ITransaction<M>>;

    public abstract unsubscribe(): void;
}
