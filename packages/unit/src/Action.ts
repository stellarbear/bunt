import {IContext, Promisify} from "./interfaces";
import {ValidationSchema} from "./Validation";

export abstract class Action<C extends IContext = Record<any, any>, S extends any = null, T extends any = any> {
    public readonly state!: S;
    protected readonly context: C;

    constructor(context: C, state: S) {
        this.context = context;
        this.state = state;
    }

    public get name(): string {
        return this.constructor.name;
    }

    public createValidationSchema(): Promisify<ValidationSchema<S>> | undefined {
        return;
    }

    public abstract run(): Promisify<T>;
}
