import {IContext, StateType} from "@bunt/unit";
import {AsyncCallback, filterValueCallback, isString, resolveOrReject} from "@bunt/util";
import {ProtoHandleAbstract} from "./ProtoHandleAbstract";

export abstract class EchoProtoHandle<C extends IContext,
    S extends StateType | null = null> extends ProtoHandleAbstract<C, S, string> {

    public static protocol = "echo-protocol";

    readonly #connection = this.getShadowState();

    protected async send(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#connection.send(message, resolveOrReject(resolve, reject));
        });
    }

    protected listen(): AsyncIterable<string> {
        return new AsyncCallback<string>((emit) => {
            const listener = filterValueCallback(isString, emit);
            this.#connection.on("message", listener);
            return () => this.#connection.removeListener("message", listener);
        });
    }
}
