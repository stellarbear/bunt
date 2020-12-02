import {assert, fails, isClass, isFunction, isInstanceOf, isUndefined, logger, Logger} from "@typesafeunit/util";
import {Action} from "./Action";
import {ApplyContext, Context} from "./Context";
import {ActionCtor, ActionReturn, ActionStateArgs, ContextArg, IContext, UnitAction} from "./interfaces";
import {IDisposable} from "./Runtime";

export class Unit<C extends IContext = IContext> implements IDisposable {
    @logger
    public readonly logger!: Logger;

    protected readonly context: C;

    private readonly registry = new WeakSet();

    protected constructor(context: C, actions: UnitAction<C, any>[] = []) {
        this.context = context;
        this.add(...actions);
    }

    public static async factory<A,
        C extends Context>(context: ContextArg<C>,
                           actions: UnitAction<C, A>[] = []): Promise<Unit<C>> {
        assert(isFunction(context) || isInstanceOf(context, Context), `Wrong context type`);
        if (isFunction(context)) {
            return new this(await context(), actions);
        }

        return new this(await context, actions);
    }

    public add<A>(...actions: UnitAction<C, A>[]): ActionCtor<Action>[] {
        const added: ActionCtor<Action>[] = [];
        for (const ctor of actions) {
            fails(isUndefined(ctor), "Arg isn't defined");
            if (!this.registry.has(ctor)) {
                this.registry.add(ctor);
                added.push(ctor);
            }
        }

        return added;
    }

    public remove<A>(...actions: UnitAction<C, A>[]): UnitAction<C, A>[] {
        const removed: UnitAction<C, A>[] = [];
        for (const ctor of actions) {
            fails(isUndefined(ctor), "Argument isn't a class constructor");
            if (this.registry.has(ctor)) {
                this.registry.delete(ctor);
                removed.push(ctor);
            }
        }

        return removed;
    }

    public has<A>(action: UnitAction<C, A>): boolean {
        return this.registry.has(action);
    }

    public getContext(): Promise<ApplyContext<C>> {
        return Context.apply(this.context);
    }

    public async run<A extends Action<any, any>>(ctor: UnitAction<C, ActionCtor<A>>,
                                                 ...args: ActionStateArgs<A>): Promise<ActionReturn<A>> {
        const finish = this.logger.perf("action", {action: ctor.name});
        assert(isClass(ctor), "First argument isn't a class constructor");
        assert(this.registry.has(ctor), `Unknown action ${ctor.name}`);

        const [state = null] = args;
        const context = await this.getContext();
        const action = new ctor(context, state);
        return Promise.resolve(action.run())
            .finally(finish);
    }

    public dispose(): IDisposable[] {
        return [...Context.disposables.values()];
    }
}

export function unit<A,
    C extends Context>(context: ContextArg<C>,
                       actions: UnitAction<C, A>[] = []): Promise<Unit<C>> {
    return Unit.factory(context, actions);
}
