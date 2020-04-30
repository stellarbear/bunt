import {isNumber} from "@typesafeunit/util";

export interface IResponseOptions {
    code?: number;
    status?: string;
    headers?: { [key: string]: string };
}

export abstract class ResponseAbstract<T> {
    public readonly code: number = 200;
    public readonly status?: string;
    public readonly type: string = "text/plain";
    public readonly encoding: string = "utf-8";
    protected readonly data: T;
    readonly #headers: { [key: string]: string };

    constructor(data: T, options: IResponseOptions = {}) {
        this.data = data;
        const {code, status, headers} = options;
        if (isNumber(code) && code > 0) {
            this.code = code;
        }

        this.status = status;
        this.#headers = headers || {};
    }

    public getHeaders() {
        return {
            ...this.#headers,
            "Content-Type": this.getContentType(),
        };
    }

    public abstract stringify(): string;

    public getContentType() {
        return `${this.type}; charset=${this.encoding}`;
    }
}
