import {Promisify} from "../interfaces";

export type TypeToJSON<T> = T extends Date ? string | number : any;
export type TransformFunction<T> = (value: TypeToJSON<T>) => Promisify<T>;
export type TransformSchema<T> = T extends Array<infer E>
    ? TransformSchemaObject<E>
    : TransformSchemaObject<T>;

export type TransformSchemaObject<T> = {
    [K in keyof T]?: T[K] extends Array<infer S>
        ? S extends object
            ? TransformFunction<S> | TransformSchemaObject<S>
            : TransformFunction<S>
        : T[K] extends object
            ? TransformFunction<T[K]> | TransformSchemaObject<T[K]>
            : TransformFunction<T[K]>;
};

export type JSONInput<T> = T extends Array<infer E>
    ? JSONInput<E>[]
    : T extends object
        ? {
            [K in keyof T]: T[K] extends Array<infer S>
                ? Array<JSONInput<S>>
                : JSONInput<T[K]>;
        }
        : T extends Date
            ? string
            : any;

export type Transformable = { [key: string]: any } | { [key: string]: any }[];
