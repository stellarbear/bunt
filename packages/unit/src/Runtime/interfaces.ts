import {Promisify} from "../interfaces";
import {DisposableSync} from "./symbols";

export interface IDisposableSync {
    [DisposableSync]: true;
}

export interface IDisposable {
    dispose(): Promisify<void>;
}

export type DisposableFn = () => Promisify<void>;
export type Disposable = DisposableFn
    | IDisposable
    | DisposableFn & IDisposableSync
    | IDisposable & IDisposableSync;
