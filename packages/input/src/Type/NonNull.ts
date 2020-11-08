import {isFunction, isNull, isUndefined, MayNullable, Promisify} from "@typesafeunit/util";
import {MayInput} from "../interfaces";
import {SuperType} from "../SuperType";
import {TypeAbstract} from "../TypeAbstract";

export class NonNull<TValue, TInput extends MayInput> extends SuperType<TValue, TValue, TInput, TInput> {
    readonly #defaultValue: TValue | (() => TValue);

    constructor(type: TypeAbstract<TValue, TInput>, defaultValue: TValue | (() => TValue)) {
        super(type);
        this.#defaultValue = defaultValue;
    }

    public validate(payload: MayNullable<TInput>): Promisify<TValue> {
        if (isNull(payload) || isUndefined(payload)) {
            if (isFunction(this.#defaultValue)) {
                return this.#defaultValue();
            }

            return this.#defaultValue;
        }

        return this.type.validate(payload);
    }
}
