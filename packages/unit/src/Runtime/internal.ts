import {isObject} from "@typesafeunit/util";
import {IDisposable, IRunnable} from "./interfaces";
import {Runtime} from "./Runtime";

export const DisposableSync = Symbol();
export const Signals: NodeJS.Signals[] = ["SIGINT", "SIGQUIT", "SIGTERM"];

export function isDisposable(candidate: unknown): candidate is IDisposable {
    return isObject(candidate) && "dispose" in candidate;
}

export function isDisposableSync(candidate: unknown): candidate is IDisposable {
    return isObject(candidate) && "dispose" in candidate && DisposableSync in candidate;
}

export function isRunnable(candidate: unknown): candidate is IRunnable {
    return isObject(candidate) && "getHeartbeat" in candidate;
}

export function main(fn: (runtime: Runtime) => any, before?: () => any): void {
    process.nextTick(async () => {
        Runtime.initialize(before);
        Runtime.run(fn);
    });
}
