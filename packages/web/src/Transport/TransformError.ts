import {isReadableError} from "@bunt/util/dist/Exception/functions";
import {ServerError} from "./ServerError";

export interface IErrorResponse {
    code: number;
    status?: string;
    body: string;
}

const map = new Map([
    ["RouteNotFound", {code: 404, status: "Not found"}],
    ["ValidationError", {code: 400, status: "Bad request"}],
    ["AssertionError", {code: 400, status: "Bad request"}],
]);

export class TransformError {
    readonly #error: Error;

    constructor(error: Error) {
        this.#error = error;
    }

    public toString(): IErrorResponse {
        return {
            body: this.getResponse(),
            ...this.getStatus(),
        };
    }

    public toJSON(): IErrorResponse {
        return {
            body: JSON.stringify(this.getResponseJSON()),
            ...this.getStatus(),
        };
    }

    private getStatus(): { code: number; status?: string } {
        if (this.#error instanceof ServerError) {
            const {code, status} = this.#error;
            return {code, status};
        }

        const name = this.#error.constructor.name;
        const status = map.get(name);

        return status ?? {code: 500, status: "Internal Server Error"};
    }

    private getResponse(): string {
        if (isReadableError(this.#error)) {
            return this.#error.toSafeString();
        }

        return this.#error.message;
    }

    private getResponseJSON(): Record<any, any> {
        if (isReadableError(this.#error)) {
            return this.#error.toSafeJSON();
        }

        return {error: this.#error.message};
    }
}
