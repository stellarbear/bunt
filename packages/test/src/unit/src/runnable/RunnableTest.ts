import {IRunnable} from "@typesafeunit/unit";
import {Heartbeat} from "@typesafeunit/unit/dist/Runtime/Heartbeat";
import {EventEmitter} from "events";

export class RunnableTest extends EventEmitter implements IRunnable<boolean> {
    public getHeartbeat() {
        return new Heartbeat<boolean>((resolve) => this.on("resolve", resolve));
    }

    declare on: (event: "resolve", fn: (value: true | Error) => void) => this;

    public crash() {
        this.emit("resolve", new Error("Crashes"));
    }

    public destroy() {
        this.emit("resolve", true);
    }
}
