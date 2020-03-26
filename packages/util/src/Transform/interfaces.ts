import {Promisify} from "../interfaces";

export type TransformFunction<T> = (value: any) => Promisify<T>;
export type TransformSchema<T> = {
    [K in keyof T]?: T[K] extends Array<infer S>
        ? S extends object ? TransformFunction<S> | TransformSchema<S> : TransformFunction<S>
        : T[K] extends object ? TransformFunction<T[K]> | TransformSchema<T[K]> : TransformFunction<T[K]>;
};

export type Transformable = { [key: string]: any } | { [key: string]: any }[];
