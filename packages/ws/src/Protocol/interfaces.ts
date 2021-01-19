import {IContext} from "@bunt/unit";
import {ProtoHandleAbstract} from "./index";

export type HandleProtoType<C extends IContext, A extends ProtoHandleAbstract<C, any>> = {
    new(context: C, state: any): A;
    isSupported(protocol: string): boolean
};
