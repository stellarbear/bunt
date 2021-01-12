import {MayNullable, Promisify} from "@bunt/util";
import {MayInput} from "../interfaces";
import {TypeAbstract} from "../TypeAbstract";

export type UnionSelector<TInput extends MayInput> =
    (input: MayNullable<TInput>) => TypeAbstract<unknown> | undefined;

export class Union<TValue, TInput extends MayInput = MayInput> extends TypeAbstract<TValue, TInput> {
    readonly #selector: UnionSelector<TInput>;
    readonly #name: string;

    constructor(selector: UnionSelector<TInput>, name = "Union") {
        super();
        this.#selector = selector;
        this.#name = name;
    }

    public get name(): string {
        return this.#name;
    }

    public validate(input: MayNullable<TInput>): Promisify<TValue> {
        const type = this.#selector(input);
        this.assert(!!type, `${this.name} detection was failed`, input);
        return type.validate(input) as Promisify<TValue>;
    }
}
