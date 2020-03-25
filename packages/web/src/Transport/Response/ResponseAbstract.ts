export abstract class ResponseAbstract<T> {
    public readonly code: number;
    public readonly status?: string;
    public readonly type: string = "text/plain";
    public readonly encoding: string = "utf-8";

    protected readonly data: T;

    constructor(data: T, code?: number, status?: string) {
        this.data = data;
        this.code = code || 200;
        this.status = status;
    }

    public abstract stringify(): string;

    public getContentType() {
        return `${this.type}; charset=${this.encoding}`;
    }
}
