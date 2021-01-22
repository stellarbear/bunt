import {Fn} from "@bunt/util";
import {ITransport} from "../interfaces";

export interface ISubscriber {
    readonly channel: string;

    unsubscribe(): Promise<void>;
    subscribe(): Promise<void>;

    listen(listener: Fn<[string], unknown>): Fn;

    close(): void;
}

export interface IPubSubTransport extends ITransport {
    publish(channel: string, message: string): Promise<number>;

    subscribe(channel: string): Promise<ISubscriber>;
}
