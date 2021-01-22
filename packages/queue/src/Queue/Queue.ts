import {ITransport} from "../interfaces";
import {QueueAbstract} from "./QueueAbstract";

export class Queue<Q extends ITransport> extends QueueAbstract<Q> {

}
