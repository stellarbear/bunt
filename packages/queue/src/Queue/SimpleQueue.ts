import {ITransport} from "./interfaces";
import {QueueAbstract} from "./QueueAbstract";

export class SimpleQueue<Q extends ITransport> extends QueueAbstract<Q> {

}
