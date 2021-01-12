import {MayNullable, Promisify} from "@bunt/util";
import {MayInput} from "../interfaces";
import {TypeAbstract} from "../TypeAbstract";

export interface IScalarType<TValue, TInput extends MayInput> {
    name: string;
    validate: (this: ScalarType<TValue, TInput>, payload: MayNullable<TInput>) => Promisify<TValue>;
}

export class ScalarType<TValue, TInput extends MayInput> extends TypeAbstract<TValue, TInput> {
    readonly #type: IScalarType<TValue, TInput>;

    public constructor(type: IScalarType<TValue, TInput>) {
        super();
        this.#type = type;
    }

    public get name(): string {
        return this.#type.name;
    }

    public validate(payload: MayNullable<TInput>): Promisify<TValue> {
        return this.#type.validate.call(this, payload);
    }
}
