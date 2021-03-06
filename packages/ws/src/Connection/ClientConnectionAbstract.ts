import {assert, AsyncCallback, filterValueCallback, isString, resolveOrReject} from "@bunt/util";
import ws from "ws";
import {IClientConnection} from "./interface";

export abstract class ClientConnectionAbstract<T> implements IClientConnection<T> {
    readonly #connection: ws;

    constructor(connection: ws) {
        this.#connection = connection;
    }

    public get ready(): boolean {
        return this.#connection.readyState === this.#connection.OPEN;
    }

    public on(event: "close", listener: () => void): this {
        this.#connection.once("close", listener);
        return this;
    }

    public send(payload: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            assert(this.#connection.readyState === this.#connection.OPEN, "Cannot send message in close state");
            this.#connection.send(this.serialize(payload), resolveOrReject(resolve, reject));
        });
    }

    public [Symbol.asyncIterator](): AsyncIterator<T> {
        const asyncCallback = new AsyncCallback<T>((emit) => {
            const listener = filterValueCallback<string>(isString, (message) => emit(this.parse(message)));
            this.#connection.on("message", listener);
            return () => this.#connection.removeListener("message", listener);
        });

        return asyncCallback[Symbol.asyncIterator]();
    }

    protected abstract serialize(payload: T): string;

    protected abstract parse(payload: string): T;
}
