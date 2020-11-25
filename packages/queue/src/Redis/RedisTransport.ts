import {Redis} from "ioredis";
import {ITransport, Message, MessageCtor, serialize} from "../Queue";
import {createConnection} from "./fn";
import {RedisChannel} from "./RedisChannel";

export class RedisTransport implements ITransport {
    readonly #connection: Redis;

    constructor(dsn?: string) {
        this.#connection = createConnection(dsn);
    }

    public channel<M extends Message>(type: MessageCtor<M>): RedisChannel<M> {
        return new RedisChannel(type, this.#connection.duplicate());
    }

    public async send<M extends Message>(message: M): Promise<void> {
        await this.#connection.lpush(message.channel, serialize(message));
    }
}
