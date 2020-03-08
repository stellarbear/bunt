import {
    assert,
    fails,
    isClass,
    isDefined,
    isFunction,
    isInstanceOf,
    isUndefined,
    memoize,
    Profiler,
} from "@typesafeunit/util";
import {Action} from "./Action";
import {Context} from "./Context";
import {ActionCtor, ActionReturn, ActionStateArgs, ContextArg, IContext, UnitAction} from "./interfaces";
import {ValidationSchema} from "./Validation";

export class Unit<C extends IContext = {}> {
    protected readonly context: C;
    private readonly registry = new WeakSet();

    protected constructor(context: C, actions: UnitAction<C, any>[] = []) {
        this.context = context;
        this.add(...actions);
    }

    @memoize
    protected get profiler() {
        return Profiler.create({
            "run": () => Object.create(null),
            "has": (action: string, exists: boolean) => ({action, exists}),
            "add": (tags: string[]) => tags,
            "remove": (tags: string[]) => tags,
            "run:error": (error: Error) => error,
            "action:validate": (valid: boolean) => valid,
            "action:create": null,
            "action:run": (payload: any) => payload,
            "action:success": null,
            "action:fails": null,
        });
    }

    public static async factory<A, C extends Context>(context: ContextArg<C>, actions: UnitAction<C, A>[] = []) {
        assert(isFunction(context) || isInstanceOf(context, Context), `Wrong context type`);
        if (isFunction(context)) {
            return new this(await context(), actions);
        }

        return new this(await context, actions);
    }

    public add<A>(...actions: UnitAction<C, A>[]) {
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

    public remove<A>(...actions: UnitAction<C, A>[]) {
        const removed: UnitAction<C, A>[] = [];
        for (const ctor of actions) {
            fails(isUndefined(ctor), "Argument isn't a class constructor");
            if (this.registry.has(ctor)) {
                this.registry.delete(ctor);
                removed.push(ctor);
            }
        }

        this.profiler.fire("remove", () => removed.map((item) => item.name));
        return removed;
    }

    public has<A>(action: UnitAction<C, A>) {
        const exists = this.registry.has(action);
        this.profiler.fire("has", {exists, action: action.name});
        return exists;
    }

    public getContext() {
        return Context.apply(this.context);
    }

    public async run<T extends Action<any, any, any>>(ctor: UnitAction<C, ActionCtor<T>>,
                                                      ...stateArgs: ActionStateArgs<T>) {
        assert(isClass(ctor), "First argument isn't a class constructor");
        assert(this.registry.has(ctor), `Unknown action ${ctor.name}`);

        const hooks = ctor.hooks || {};
        const [state] = stateArgs;
        const context = await this.getContext();

        try {
            if (isFunction(hooks.validate)) {
                const staticValidationSchema = await hooks.validate(new ValidationSchema(), context);
                const validationDescription = await staticValidationSchema.validate(state);

                this.profiler.fire("action:validate", validationDescription.valid);
                await staticValidationSchema.assert(validationDescription, `${ctor.name} validation failed`);
            }

            const action = new ctor(context, state);
            const validationSchema = await action.createValidationSchema();
            if (isDefined(validationSchema)) {
                const validationDescription = await validationSchema.validate(state);
                this.profiler.fire("action:validate", validationDescription.valid);
                validationSchema.assert(validationDescription, `${ctor.name} validation failed`);
            }

            if (isFunction(hooks.create)) {
                this.profiler.fire("action:create");
                await hooks.create(context, state);
            }

            this.profiler.fire("action:run", state);
            const result = await action.run();
            if (isFunction(hooks.success)) {
                this.profiler.fire("action:success");
                await hooks.success(result, context);
            }

            return result as ActionReturn<T>;
        } catch (error) {
            this.profiler.fire("run:error", error);
            if (isFunction(hooks.fails)) {
                this.profiler.fire("action:fails");
                await hooks.fails(error, context);
            }

            throw error;
        }
    }

    public getProfiler() {
        return this.profiler;
    }
}

export function unit<A, C extends Context>(context: ContextArg<C>, actions: UnitAction<C, A>[] = []) {
    return Unit.factory(context, actions);
}
