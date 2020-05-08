import {IResponseOptions, ResponseAbstract} from "./ResponseAbstract";

export class NoContentResponse extends ResponseAbstract<string> {
    constructor(options: IResponseOptions & { code?: never } = {}) {
        super("", {status: "No Content", ...options, code: 204});
    }

    public stringify(): string {
        return this.data;
    }
}
