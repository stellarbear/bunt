import {IContext, Promisify} from "./interfaces";

export abstract class Action<C extends IContext = Record<any, any>,
    S extends Record<string, any> | null = null,
    T extends any = any> {

    public readonly state!: S;
    protected readonly context: C;

    constructor(context: C, state: S) {
        this.context = context;
        this.state = state;
    }

    public get name(): string {
        return this.constructor.name;
    }

    public abstract run(): Promisify<T>;
}
