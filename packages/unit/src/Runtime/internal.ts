import {IDisposable, IRunnable} from "./interfaces";

export const DisposableSync = Symbol();
export const Signals: NodeJS.Signals[] = ["SIGINT", "SIGQUIT", "SIGTERM"];

export function isDisposable(candidate: any): candidate is IDisposable {
    return "dispose" in candidate;
}

export function isDisposableSync(candidate: any): candidate is IDisposable {
    return "dispose" in candidate && DisposableSync in candidate;
}

export function isRunnable(candidate: any): candidate is IRunnable {
    return "getHeartbeat" in candidate;
}
