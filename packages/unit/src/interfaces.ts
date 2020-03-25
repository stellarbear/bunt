import {Action} from "./Action";
import {Context, MatchContext} from "./Context";
import {ValidationSchema} from "./Validation";

export interface IContext {}

export type Promisify<T> = T | Promise<T>;
export type ContextArg<C extends Context> = (() => Promisify<C>) | Promisify<C>;

export type ActionStateArgs<A> = ActionState<A> extends null ? [] : [ActionState<A>];
export type ActionCtor<A extends Action<any, any, any>> = {
    new(context: ActionCtx<A>, state: any): A;
    readonly hooks?: IActionHooks<any, any, any>;
    prototype: A;
};

export type ActionCtx<A> = A extends Action<infer T, any, any> ? T : never;
export type ActionState<A> = A extends Action<any, infer T, any> ? T : never;
export type ActionReturn<A> = A extends Action<any, any, infer T> ? T : never;

export type UnitAction<C, T> = T extends ActionCtor<infer A>
    ? A extends Action<infer AC, any, any>
        ? MatchContext<C, AC> extends AC
            ? T
            : never // ["Action context doesn't match its parent context", C, AC]
        : never // ["Action doesn't satisfy its interface", A]
    : never; // ["Action doesn't satisfy its type", T];

export type ResolvableValue<T> = Promise<T> | (() => T | Promise<T>);

export interface IServiceResolver<T> {
    resolve(): Promise<T>;
}

export type ActionHookCreate<C extends Context, S = null> = (context: C, state: S) => Promisify<void>;
export type ActionHookSuccess<C extends Context, T> = (returns: T, context: C) => Promisify<void>;
export type ActionHookError<C extends Context> = (error: Error, context: C) => Promisify<void>;
export type ActionHookValidate<C extends Context, S = null> = (validationSchema: ValidationSchema<S>,
                                                               context: C) => ValidationSchema<S>;

export interface IActionHooks<C extends Context, S = null, T = any> {
    validate?: ActionHookValidate<C, S>;
    create?: ActionHookCreate<C, S>;
    success?: ActionHookSuccess<C, T>;
    fails?: ActionHookError<C>;
}

export type ActionHooks<A> = A extends Action<infer X, infer S, infer T>
    ? IActionHooks<X, S, T>
    : A extends ActionCtor<infer C>
        ? A extends Action<infer X, infer S, infer T>
            ? IActionHooks<X, S, T>
            : never
        : never;
