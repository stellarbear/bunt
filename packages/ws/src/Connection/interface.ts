export interface IClientConnection<T> extends AsyncIterable<T> {
    send(message: T): void;
}
