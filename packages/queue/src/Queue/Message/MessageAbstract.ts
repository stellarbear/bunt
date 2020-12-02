export abstract class MessageAbstract<T> {
    public readonly payload: T;

    constructor(payload: T) {
        this.payload = payload;
    }

    public get channel(): string {
        return this.constructor.name;
    }

    public static get channel(): string {
        return this.prototype.channel;
    }
}
