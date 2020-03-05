import {Promisify} from "@typesafeunit/unit";
import {isFunction} from "@typesafeunit/util";
import {IHeaders, IRequest, RequestTransformType} from "../interfaces";

export abstract class RequestAbstract implements IRequest {
    public abstract readonly route: string;
    public abstract readonly headers: IHeaders;

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

    public abstract createReadableStream(): Promisify<NodeJS.ReadableStream>;
}
