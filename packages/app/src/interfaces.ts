import {Action, Context, MatchContext, Promisify} from "@typesafeunit/unit";
import {RouteAbstract} from "./Route";

export type RouteResponse = Error
    | {stringify(): string}
    | NodeJS.ReadableStream
    | Buffer
    | string
    | number
    | boolean
    | null
    | undefined
    | void;

export type RouteAction = Action<any, any, RouteResponse>;

export type MatchRoute<C extends Context, R> = R extends RouteAbstract<infer A>
    ? A extends Action<infer AC, any, RouteResponse>
        ? MatchContext<C, AC> extends AC
            ? R
            : ["Action context doesn't match its parent context", C, AC]
        : ["Action doesn't satisfy its interface", A]
    : never;


export interface IKeyValueMap {
    has(name: string): boolean;

    get(name: string, defaultValue?: string): string;

    set(name: string, value: string): void;

    delete(name: string): void;

    entries(): [string, string][];

    toObject(): { [key: string]: string };
}

export interface IKeyValueReadonlyMap extends IKeyValueMap {
    set: never;
    delete: never;
}

export interface IRequestBodyTransform<T> {
    transform(request: IRequest): Promise<T>;
}

export type RequestTransformType<T> = IRequestBodyTransform<T> | ((request: IRequest) => Promise<T>);

export interface IRequest {
    readonly route: string;
    readonly headers: IHeaders;

    getBuffer(): Promise<Buffer>;
    createReadableStream(): Promisify<NodeJS.ReadableStream>;
    transform<T>(transformer: RequestTransformType<T>): Promise<T>;
}

export type HeaderAssertValue = |
    string |
    string[] |
    ((value: string) => boolean | void);

export interface IHeaders extends IKeyValueReadonlyMap {
    assert(header: string, values: HeaderAssertValue): void;
}
