import {Promisify} from "@bunt/unit";
import {assert, ILogable, isFunction} from "@bunt/util";
import {IHeaders, IRequest, IRequestTransform, RequestTransformType, RouteResponse} from "../interfaces";
import {fromJsonRequest} from "./Request";

export abstract class RequestAbstract implements IRequest, ILogable<{ route: string }> {
    public abstract readonly route: string;
    public abstract readonly headers: IHeaders;

    #complete = false;

    public get complete(): boolean {
        return this.#complete;
    }

    public async getBuffer(): Promise<Buffer> {
        const chunks: Buffer[] = [];
        const readableStream = await this.createReadableStream();
        for await (const chunk of readableStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        return Buffer.concat(chunks);
    }

    public transform<T>(transformer: RequestTransformType<T>): Promise<T> {
        if (isFunction(transformer)) {
            return transformer(this);
        }

        return transformer.transform(this);
    }

    public async to<T>(transform: IRequestTransform<T>): Promise<T> {
        this.headers.assert("content-type", [transform.type].flat(1));
        return transform(await this.getBuffer());
    }

    public toObject<T = unknown>(): Promise<T> {
        return this.to<unknown>(fromJsonRequest) as Promise<T>;
    }

    public async respond(response: RouteResponse): Promise<void> {
        assert(!this.complete, `Response was already sent`);
        try {
            await this.write(response);
        } finally {
            this.#complete = true;
        }
    }

    public abstract validate(): boolean;

    public abstract createReadableStream(): Promisify<NodeJS.ReadableStream>;

    public getLogValue(): { route: string } {
        return {route: this.route};
    }

    protected abstract write(response: RouteResponse): Promise<void>;
}
