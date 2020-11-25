import {isFunction} from "@typesafeunit/util";
import {FieldSelectType, MayInput} from "./interfaces";
import {TypeAbstract} from "./TypeAbstract";

export async function validate<T>(type: FieldSelectType<T>, value: unknown): Promise<T> {
    if (isFunction(type)) {
        return type().validate(value as MayInput);
    }

    return (type as TypeAbstract<T>).validate(value as MayInput);
}
