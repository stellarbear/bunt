import {IContext, StateType} from "@bunt/unit";
import {ClientConnection} from "../Connection/ClientConnection";
import {ProtoHandleAbstract} from "./ProtoHandleAbstract";

export abstract class EchoProtoHandle<C extends IContext,
    S extends StateType | null = null> extends ProtoHandleAbstract<C, S> {

    public static protocol = "echo-protocol";

    readonly #connection = new ClientConnection(this.getShadowState());

    public get connection(): ClientConnection {
        return this.#connection;
    }

    protected send(message: string): Promise<void> {
        return this.#connection.send(message);
    }
}
