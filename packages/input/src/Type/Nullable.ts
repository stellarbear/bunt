import {isNull, isUndefined, MayNullable, Promisify} from "@typesafeunit/util";
import {MayInput} from "../interfaces";
import {SuperType} from "../SuperType";

export class Nullable<TValue, TInput extends MayInput> extends SuperType<TValue | undefined, TValue, TInput, TInput> {
    public validate(payload: MayNullable<TInput>): Promisify<TValue | undefined> {
        if (isNull(payload) || isUndefined(payload)) {
            return undefined;
        }

        return this.type.validate(payload);
    }
}
