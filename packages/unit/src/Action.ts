import {assert, Promisify} from "@bunt/util";
import {ShadowState} from "./Context";
import {IContext, StateType} from "./interfaces";

export abstract class Action<C extends IContext = Record<any, any>,
    S extends StateType | null = null,
    T extends any = any,
    SS extends any = any> {

    public readonly state!: S;
    protected readonly context: C;

    constructor(context: C, state: S) {
        this.context = context;
        this.state = state;
    }

    public get name(): string {
        return this.constructor.name;
    }

    public getShadowState(): SS {
        const shadowState = ShadowState.get<SS>(this.state);
        assert(shadowState, "Shadow state should be defined");
        return shadowState;
    }

    public abstract run(): Promisify<T>;
}
