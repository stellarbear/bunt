import {IHeaders, KeyValueMap, RequestAbstract, RouteResponse} from "@typesafeunit/app";
import {
    isBoolean,
    isError,
    isNull,
    isNumber,
    isObject,
    isReadableStream,
    isString,
    isUndefined,
} from "@typesafeunit/util";
import {IncomingMessage, ServerResponse} from "http";
import {parse} from "url";
import {Headers} from "./Headers";
import {ResponseAbstract} from "./Response";
import {TransformError} from "./TransformError";

interface ISendOptions {
    code: number;
    status?: string;
    headers?: { [key: string]: string };
}

export class Request extends RequestAbstract {
    public readonly headers: IHeaders;
    public readonly route: string;

    private readonly incomingMessage: IncomingMessage;
    private readonly serverResponse: ServerResponse;

    constructor(incomingMessage: IncomingMessage, serverResponse: ServerResponse) {
        super();
        this.incomingMessage = incomingMessage;
        this.serverResponse = serverResponse;

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

    /**
     * @param response
     */
    protected async write(response: RouteResponse) {
        // @TODO Validate types in the Accept header before send a response.

        if (isUndefined(response) || isNull(response)) {
            return this.send("");
        }

        if (isString(response) || isNumber(response) || isBoolean(response)) {
            return this.send(response.toString());
        }

        if (isObject(response)) {
            if (Buffer.isBuffer(response)) {
                return this.send(response);
            }

            if (isReadableStream(response)) {
                response.pipe(this.serverResponse);
                return;
            }

            if (isError(response)) {
                const transform = new TransformError(response);
                const accept = this.headers.get("accept");
                const {response: transformed, ...status} = accept.includes("application/json")
                    ? transform.toJSON()
                    : transform.toString();

                if (accept.includes("application/json")) {
                    return this.send(transformed, {...status, headers: {"content-type": "application/json"}});
                }

                return this.send(transformed, {...status});
            }

            if (response instanceof ResponseAbstract) {
                const {code, status} = response;
                return this.send(
                    response.stringify(),
                    {code, status, headers: {"content-type": response.getContentType()}},
                );
            }

            return this.send(JSON.stringify(response));
        }
    }

    /**
     * @param body
     * @param options
     */
    protected send(body: string | undefined | Buffer, options: ISendOptions = {code: 200}) {
        try {
            const {code, status} = options;
            const headers = new KeyValueMap(Object.entries(options.headers || {}));
            if (!headers.has("content-type")) {
                headers.set("context-type", "text/plain; charset=utf-8");
            }

            for (const [header, value] of headers.entries()) {
                this.serverResponse.setHeader(header, value);
            }

            this.serverResponse.writeHead(code, status);
            this.serverResponse.write(body);
        } finally {
            this.serverResponse.end();
        }
    }
}
