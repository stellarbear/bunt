import {IContext, Promisify} from "./interfaces";

export abstract class Action<C extends IContext = {}, S extends any = null, T extends any = any> {
    public readonly state!: S;
    protected readonly context: C;

    constructor(context: C, state: S) {
        this.context = context;
        this.state = state;
    }

    public get name() {
        return this.constructor.name;
    }

    public abstract run(): Promisify<T>;
}
