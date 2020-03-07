import {IHeaders, RequestAbstract} from "@typesafeunit/app";
import {Readable} from "stream";
import {Headers} from "./Headers";

export class Request extends RequestAbstract {
    public readonly headers: IHeaders;
    public readonly route: string;
    public readonly body: string;

    constructor(route: string, headers: { [key: string]: string }, body = "") {
        super();
        this.route = route;
        this.headers = new Headers(Object.entries(headers));
        this.body = body;
    }

    public createReadableStream() {
        return Readable.from(this.body);
    }
}
