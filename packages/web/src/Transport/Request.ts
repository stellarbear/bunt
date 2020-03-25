import {IHeaders, RequestAbstract} from "@typesafeunit/app";
import {isString} from "@typesafeunit/util";
import {IncomingMessage} from "http";
import {parse} from "url";
import {Headers} from "./Headers";

export class Request extends RequestAbstract {
    public readonly headers: IHeaders;
    public readonly route: string;

    private readonly incomingMessage: IncomingMessage;

    constructor(incomingMessage: IncomingMessage) {
        super();
        this.incomingMessage = incomingMessage;
        const headers: [string, string][] = [];
        for (const [key, value] of Object.entries(this.incomingMessage.headers)) {
            if (isString(value)) {
                headers.push([key, value]);
            }
        }

        this.route = this.getRoute();
        this.headers = new Headers(headers);
    }

    public createReadableStream(): NodeJS.ReadableStream {
        return this.incomingMessage;
    }

    protected getRoute() {
        const {pathname} = parse(this.incomingMessage.url || "/", true);
        const {method = "GET"} = this.incomingMessage;
        return `${method} ${pathname}`;
    }
}
