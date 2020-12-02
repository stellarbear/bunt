import {Redis} from "ioredis";
import {Message, MessageCtor, ReadOperation} from "../Queue";
import {ReaderAbstract} from "../Queue/ReaderAbstract";
import {RedisTransport} from "./RedisTransport";

export class RedisReader<M extends Message, MC extends MessageCtor<M>>
    extends ReaderAbstract<M, MC, ReadOperation<M>> {
    protected readonly timeout = 100;
    readonly #transport: RedisTransport;
    readonly #connection: Redis;

    constructor(transport: RedisTransport, type: MC) {
        super(type);
        this.#transport = transport;
        this.#connection = transport.duplicate();
    }

    protected get connection(): Redis {
        return this.#connection;
    }

    public async dispose(): Promise<void> {
        await this.#connection.disconnect();
    }

    public async cancel(): Promise<void> {
        // not support
    }

    protected next(): Promise<string | undefined> {
        return this.wrap(this.#connection.brpop(this.channel, this.timeout).then((message) => message?.[1]));
    }

    protected createReadOperation(message: M): ReadOperation<M> {
        return new ReadOperation(message);
    }

    protected wrap(result: Promise<string | undefined>): Promise<string | undefined> {
        return result.catch(() => undefined);
    }
}
