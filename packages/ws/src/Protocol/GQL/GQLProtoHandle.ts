import {IContext, StateType} from "@bunt/unit";
import {Promisify} from "@bunt/util";
import {GQLClientConnection, GQLClientPayload, GQLProtoLayer, GQLServerOperation} from "./index";
import {ProtoHandleAbstract} from "../ProtoHandleAbstract";

export abstract class GQLProtoHandle<C extends IContext,
    S extends StateType | null = null> extends ProtoHandleAbstract<C, S, GQLServerOperation> {

    public static protocol = "graphql-ws";

    readonly #connection = new GQLClientConnection(this.getShadowState());

    public abstract subscribe(payload: GQLClientPayload): Promisify<AsyncIterableIterator<any>>;

    public async run(): Promise<void> {
        const layer = new GQLProtoLayer(this.#connection, (payload) => this.subscribe(payload));
        for await (const operation of this.#connection) {
            await layer.handle(operation);
        }
    }
}
