import {Redis} from "ioredis";
import {ChannelAbstract, Message, MessageCtor, unserialize} from "../Queue";
import {RedisTransaction} from "./RedisTransaction";

export class RedisChannel<M extends Message> extends ChannelAbstract<M> {
    readonly #connection: Redis;

    #done = false;
    #pending?: Promise<[string, string]>;

    constructor(type: MessageCtor<M>, connection: Redis) {
        super(type);
        this.#connection = connection;
    }

    public get subscribed(): boolean {
        return !this.#done;
    }

    public async* subscribe(): AsyncGenerator<RedisTransaction<M>> {
        this.#connection.connect();
        while (!this.#done) {
            this.#pending = this.#connection.blpop(this.key, 100);
            const response = await this.#pending;
            if (response && response.length === 2) {
                try {
                    const [, message] = response;
                    yield new RedisTransaction(new this.type(unserialize(message)));
                } catch (error) {

                }
            }
        }
    }

    public async unsubscribe(): Promise<void> {
        this.#done = true;
        await this.#pending;
    }
}
