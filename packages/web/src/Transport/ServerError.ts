export class ServerError extends Error {
    public readonly code: number;
    public readonly status?: string;

    constructor(message: string, code = 500, status?: string) {
        super(message);
        this.code = code;
        this.status = status || message;
    }
}
