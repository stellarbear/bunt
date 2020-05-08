import {IHeaders, KeyValueMap, RequestAbstract, RouteResponse} from "@typesafeunit/app";
import {
    isBoolean,
    isError, isFunction,
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
import {IServerOptions} from "./interfaces";
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

    private readonly message: IncomingMessage;
    private readonly response: ServerResponse;

    protected readonly options: IServerOptions;

    constructor(incomingMessage: IncomingMessage, serverResponse: ServerResponse, options?: IServerOptions) {
        super();
        this.message = incomingMessage;
        this.response = serverResponse;
        this.options = options ?? {};

        const headers: [string, string][] = [];
        for (const [key, value] of Object.entries(this.message.headers)) {
            if (isString(value)) {
                headers.push([key, value]);
            }
        }

        this.route = this.getRoute();
        this.headers = new Headers(headers);
    }

    public createReadableStream(): NodeJS.ReadableStream {
        return this.message;
    }

    protected getRoute() {
        const {pathname} = parse(this.message.url || "/", true);
        const {method = "GET"} = this.message;
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
                response.pipe(this.response);
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
                    {code, status, headers: response.getHeaders()},
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
                this.response.setHeader(header, value);
            }

            this.applyServerOptions();

            this.response.writeHead(code, status);
            this.response.write(body);
        } finally {
            this.response.end();
        }
    }

    protected applyServerOptions() {
        const headers = this.getServerHeaders();
        for (const [header, value] of Object.entries(headers)) {
            this.response.setHeader(header, value);
        }
    }

    protected getServerHeaders() {
        const headers = this.options.headers ?? {};
        if (isFunction(headers)) {
            return headers(this);
        }

        return headers;
    }
}
