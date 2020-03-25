import {IRequest, KeyValueMap, RouteResponse, TransportAbstract} from "@typesafeunit/app";
import {NotFound} from "@typesafeunit/app/dist/Error/NotFound";
import {ValidationError} from "@typesafeunit/unit/dist/Validation/ValidationError";
import {isBoolean, isNumber, isObject, isReadableStream, isString, isUndefined} from "@typesafeunit/util";
import {IncomingMessage, ServerResponse} from "http";
import {ResponseAbstract} from "./Response/ResponseAbstract";
import {ServerError} from "./ServerError";
import {Request} from "./Request";

interface ISendOptions {
    code: number;
    status?: string;
    headers?: { [key: string]: string };
}

export class Connection extends TransportAbstract {
    public readonly request: IRequest;
    private readonly response: ServerResponse;

    constructor(request: IncomingMessage, response: ServerResponse) {
        super();
        this.request = new Request(request);
        this.response = response;
    }

    /**
     * @param response
     */
    protected async write(response: RouteResponse) {
        // @TODO Validate types in the Accept header before send a response.

        if (isUndefined((response))) {
            return this.send(response);
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

            if (response instanceof Error) {
                if (response instanceof NotFound) {
                    return this.send(response.message, {code: 404, status: "Not found"});
                }

                if (response instanceof ValidationError) {
                    return this.send(response.message, {code: 400, status: "Bad request"});
                }

                if (response instanceof ServerError) {
                    return this.send(response.message, {code: response.code, status: response.status});
                }

                return this.send(
                    "Internal Server Error",
                    {code: 500, status: "Internal Server Error"},
                );
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
                this.response.setHeader(header, value);
            }

            this.response.writeHead(code, status);
            this.response.write(body);
        } finally {
            this.response.end();
        }
    }
}
