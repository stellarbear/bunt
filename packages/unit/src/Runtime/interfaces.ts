import {Promisify} from "../interfaces";
import {Heartbeat} from "./Heartbeat";
import {DisposableSync} from "./index";

export interface IRunnable<TState = unknown> {
    getHeartbeat(): Heartbeat<TState>;
}

export interface IDestroyable<TState = unknown> {
    destroy(): Promisify<void> | Heartbeat<TState>;
}

export interface IDisposableSync {
    [DisposableSync]: true;
}

export interface IDisposable {
    dispose(): Promisify<Disposable | Disposable[] | void>;
}

export type DisposableFn = () => Promisify<void>;
export type Disposable = DisposableFn
    | IDisposable
    | IDisposableSync & DisposableFn
    | IDisposable & IDisposableSync;
