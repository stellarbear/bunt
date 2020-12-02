import {TaskAbstract} from "../../../src";
import {HelloReply} from "./HelloReply";

export class HelloAsk extends TaskAbstract<string, string> {
    public reply(reply: string): HelloReply {
        return new HelloReply(reply);
    }
}
