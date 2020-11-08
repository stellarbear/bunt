import {FieldSelectType, MayInput} from "./interfaces";
import {TypeAbstract} from "./TypeAbstract";

export async function validate<T>(type: FieldSelectType<T>, value: unknown): Promise<T> {
    return (type as TypeAbstract<T>).validate(value as MayInput);
}
