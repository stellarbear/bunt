import {Promisify} from "../interfaces";
import {isArray, isFunction, isObject} from "../is";
import {JSONInput, Transformable, TransformSchema} from "./interfaces";

export class TransformInput<T, K extends keyof T> {
    public static transform<T extends Transformable>(data: JSONInput<T>, scheme: TransformSchema<T>): Promise<T>;
    public static async transform<T extends Transformable>(data: JSONInput<T>, schema: TransformSchema<T>) {
        if (isArray(data)) {
            return Promise.all(data.map((item: any) => this.transform(item, schema)));
        }

        for (const [property, transform] of Object.entries(schema)) {
            if (!Reflect.has(data, property)) {
                continue;
            }

            const sourceValue = Reflect.get(data, property);
            if (isFunction(transform)) {
                Reflect.set(data, property, await transform(sourceValue));
                continue;
            }

            if (isObject(transform)) {
                await this.transform(sourceValue, transform);
            }
        }

        return data;
    }

    public static create<T>(schema: TransformSchema<T>) {
        return async (data: Promisify<JSONInput<T>>) => {
            return this.transform(await data, schema);
        };
    }
}
