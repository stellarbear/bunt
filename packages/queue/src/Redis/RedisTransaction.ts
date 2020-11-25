import {Message, TransactionAbstract} from "../Queue";

export class RedisTransaction<M extends Message> extends TransactionAbstract<M> {

}
