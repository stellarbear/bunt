import {IContext} from "@typesafeunit/unit";
import {Promisify} from "@typesafeunit/util";
import {Handler} from "./Handler";
import {Message, MessagePayload, TaskAbstract} from "./Queue";

export type ActionHandler<C extends IContext, M extends Message> = Handler<C, M>;

export type HandlerReturn<M extends Message> = M extends TaskAbstract<any, infer R>
    ? Promisify<R>
    : Promisify<any>;

export type HandlerState<M extends Message> = { payload: MessagePayload<M> };
