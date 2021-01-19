import {AsyncCallback, filterValueCallback, isString, resolveOrReject} from "@bunt/util";
import ws from "ws";
import {IClientConnection} from "./interface";

export abstract class ClientConnectionAbstract<T> implements IClientConnection<T> {
    readonly #connection: ws;

    constructor(connection: ws) {
        this.#connection = connection;
    }

    public send(payload: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
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
