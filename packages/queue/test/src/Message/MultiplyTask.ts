import {TaskAbstract} from "../../../src";
import {NumMessage} from "./NumMessage";

export class MultiplyTask extends TaskAbstract<number[], number> {
    public reply(reply: number): NumMessage {
        return new NumMessage(reply);
    }
}
