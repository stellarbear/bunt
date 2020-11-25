export class MessageAbstract<T> {
    public id?: string;

    public readonly payload: T;

    constructor(payload: T) {
        this.payload = payload;
    }

    public get channel(): string {
        return this.id ?? this.constructor.name;
    }

    public static get channel(): string {
        return this.prototype.channel;
    }
}
