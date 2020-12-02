import {Disposable, IDisposable} from "@typesafeunit/unit";
import {Redis} from "ioredis";
import {isTransactionMessage, ITransport, Message, MessageCtor, MessageHandler, serialize} from "../Queue";
import {createConnection} from "./fn";
import {RedisQ2Reader} from "./RedisQ2Reader";
import {RedisReader} from "./RedisReader";
import {RedisSubscription} from "./RedisSubscription";

export class RedisTransport implements ITransport {
    readonly #connection: Redis;
    readonly #disposable: IDisposable[] = [];

    constructor(dsn?: string) {
        this.#connection = createConnection(dsn);
    }

    public get connection(): Redis {
        return this.#connection;
    }

    public duplicate(): Redis {
        return this.connection.duplicate();
    }

    public async send<M extends Message>(message: M): Promise<void> {
        await this.#connection.lpush(message.channel, serialize(message));
    }

    public subscribe<M extends Message>(type: MessageCtor<M>, handler: MessageHandler<M>): RedisSubscription<M> {
        return this.register(new RedisSubscription(this, type, handler));
    }

    public reader<M extends Message>(type: MessageCtor<M>): RedisReader<M, MessageCtor<M>> {
        if (isTransactionMessage(type)) {
            return this.register(new RedisQ2Reader(this, type));
        }

        return this.register(new RedisReader(this, type));
    }

    public async dispose(): Promise<Disposable[]> {
        return [
            ...this.#disposable,
            () => this.#connection.disconnect(),
        ];
    }

    private register<T extends IDisposable>(value: T): T {
        this.#disposable.push(value);
        return value;
    }
}
