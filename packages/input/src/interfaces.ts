import {MaybeArray, MayNullable} from "@typesafeunit/util";
import {List, ObjectType} from "./Type";
import {TypeAbstract} from "./TypeAbstract";

export type Scalars = string | number | boolean;

export interface Compound {
    [key: string]: MaybeArray<Scalars | Compound>;
}

export type MayInput = MayNullable<MaybeArray<MayNullable<Scalars | Compound>>>;
export type MayListInput = MayNullable<Scalars | Compound>;

export type FieldFn<T> = () => T;
export type FieldType<T> = T | FieldFn<T>;

export type FieldsSchema<T> = {
    [K in keyof T]-?: T[K] extends Array<infer S>
        ? FieldType<List<S, any>>
        : T[K] extends Record<string, MayInput>
            ? FieldType<ObjectType<T[K]>>
            : FieldType<TypeAbstract<T[K]>>;
};

export type ObjectFields<T> = T extends Promise<infer A>
    ? FieldsSchema<Exclude<A, undefined>>
    : FieldsSchema<Exclude<T, undefined>>;

export type FieldSelectType<T> = T extends Record<string, any>
    ? ObjectType<T>
    : T extends Array<infer I>
        ? List<I>
        : TypeAbstract<T>;
