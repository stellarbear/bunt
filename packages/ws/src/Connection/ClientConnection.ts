import {AsyncCallback, filterValueCallback, isString} from "@bunt/util";
import ws from "ws";
import {IClientConnection} from "./interface";

export abstract class ClientConnection<T> implements IClientConnection<T> {
    readonly #connection: ws;

    constructor(connection: ws) {
        this.#connection = connection;
    }

    public send(payload: T): void {
        this.#connection.send(this.serialize(payload));
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
