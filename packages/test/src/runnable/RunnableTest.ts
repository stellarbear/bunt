import {EventEmitter} from "events";
import {IRunnable} from "../../../unit";
import {Heartbeat} from "../../../unit/dist/Runtime/Heartbeat";

export class RunnableTest extends EventEmitter implements IRunnable<boolean> {
    declare on: (event: "resolve", fn: (value: true | Error) => void) => this;

    public getHeartbeat(): Heartbeat<boolean> {
        return new Heartbeat<boolean>((resolve) => this.on("resolve", resolve));
    }

    public crash(): void {
        this.emit("resolve", new Error("Crashes"));
    }

    public destroy(): void {
        this.emit("resolve", true);
    }
}
