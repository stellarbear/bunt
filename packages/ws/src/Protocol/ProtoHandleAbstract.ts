import {Action, IContext, StateType} from "@bunt/unit";
import {Logger, logger} from "@bunt/util";
import ws from "ws";

export abstract class ProtoHandleAbstract<C extends IContext, S extends StateType | null = null>
    extends Action<C, S, void, ws> {
    /**
     * Supported WebSocket protocol, should be extended in child
     * classes for validation purposes before they will be run.
     *
     * @static
     * @abstract
     */
    protected static protocol: string;

    @logger
    protected logger!: Logger;

    public static isSupported(protocol: string): boolean {
        return this.protocol.toLowerCase() === protocol.toLowerCase();
    }
}
