import {MayInput} from "./interfaces";
import {TypeAbstract} from "./TypeAbstract";

export abstract class SuperType<TValue, SValue,
    TInput extends MayInput,
    SInput extends MayInput> extends TypeAbstract<TValue, TInput> {
    protected readonly type: TypeAbstract<SValue, SInput>;

    constructor(type: TypeAbstract<SValue, SInput>) {
        super();
        this.type = type;
    }
}
