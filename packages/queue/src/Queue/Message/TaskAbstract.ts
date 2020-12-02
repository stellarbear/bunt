import {MessageAbstract} from "./MessageAbstract";

export abstract class TaskAbstract<T, R> extends MessageAbstract<T> {
    public abstract reply(reply: R): MessageAbstract<R>;
}
