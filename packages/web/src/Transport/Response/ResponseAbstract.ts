import {isInstanceOf, isNumber} from "@typesafeunit/util";
import * as HTTP from "http-status";
import {Headers} from "../Headers";

export interface IResponseOptions {
    code?: number;
    status?: string;
    headers?: { [key: string]: string } | Headers;
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
        if (!this.status && this.code in HTTP) {
            this.status = Reflect.get(HTTP, this.code);
        }

        if (isInstanceOf(headers, Headers)) {
            this.#headers = headers.toJSON();
        } else {
            this.#headers = headers || {};
        }
    }

    public getHeaders(): Record<any, string> {
        return {
            ...this.#headers,
            "Content-Type": this.getContentType(),
        };
    }

    public abstract stringify(): string;

    public getContentType(): string {
        return `${this.type}; charset=${this.encoding}`;
    }
}
