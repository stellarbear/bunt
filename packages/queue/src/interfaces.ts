import {IContext, IDisposable} from "@bunt/unit";
import {Promisify} from "@bunt/util";
import {Handler} from "./Handler";
import {IQueueList, IQueueReader, Message, MessageCtor, MessageHandler, MessagePayload, TaskAbstract} from "./Queue";

export type ActionHandler<C extends IContext, M extends Message> = Handler<C, M>;

export type HandlerReturn<M extends Message> = M extends TaskAbstract<any, infer R>
    ? Promisify<R>
    : Promisify<any>;

export type HandlerState<M extends Message> = { payload: MessagePayload<M> };

export interface ITransport extends IDisposable {
    send<M extends Message>(message: M): Promisify<void>;

    createQueueList<M extends Message>(type: MessageCtor<M>, handler: MessageHandler<M>): IQueueList<M>;

    createQueueReader<M extends Message>(type: MessageCtor<M>): IQueueReader<M>;
}
