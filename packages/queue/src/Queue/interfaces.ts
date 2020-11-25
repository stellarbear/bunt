import {Promisify} from "@typesafeunit/util";
import {MessageAbstract} from "./MessageAbstract";

export interface ITransaction<M extends Message> {
    message: M;

    commit(): Promise<HandleResult<M>>;

    rollback(reason?: Error): Promise<IHandleFail<M>>;
}

export interface IChannel<M extends MessageAbstract<any>> {
    readonly type: MessageCtor<M>;
    readonly subscribed: boolean;
    readonly key: string;

    subscribe(): AsyncGenerator<ITransaction<M>>;

    unsubscribe(): void;
}

export interface ITransport {
    send<M extends Message>(message: M): Promisify<void>;

    channel<M extends Message>(type: MessageCtor<M>): IChannel<M>;
}

export interface IMessageHandler<M extends MessageAbstract<any>> {
    (message: M): unknown;
}

export type QueueKeys<T> = Extract<keyof T, string>;

export interface IHandleState<M extends Message> {
    error?: Error;
    status: boolean;
    message: M;
    finishAt: Date;
    runAt: Date;
}

export interface IHandleSuccess<M extends Message> extends IHandleState<M> {
    status: true;
    error?: never;
}

export interface IHandleFail<M extends Message> extends IHandleState<M> {
    status: false;
    error: Error;
}

export type HandleResult<M extends Message> = IHandleSuccess<M> | IHandleFail<M>;

export interface IHandleResultFactory<M extends Message> {
    (): IHandleSuccess<M>;

    (error: Error): IHandleFail<M>;
}

export interface ISubscription<M extends Message> {
    unsubscribe(): Promise<void>;

    listenResult(fn: (result: HandleResult<M>) => unknown): void;
}

export type MessagePayload<T extends MessageAbstract<any>> = T extends MessageAbstract<infer P> ? P : never;

export interface MessageCtor<M extends MessageAbstract<any>> {
    prototype: M;

    readonly channel: string;

    new(message: MessagePayload<M>): M;
}

export type Message<T extends MessageAbstract<any> = MessageAbstract<any>> = T;
