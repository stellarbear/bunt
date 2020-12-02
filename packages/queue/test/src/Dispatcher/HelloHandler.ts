import {IContext} from "@typesafeunit/unit";
import {Handler} from "../../../src/Handler";
import {HelloAsk} from "./HelloAsk";

export class HelloHandler extends Handler<IContext, HelloAsk> {
    public run(): string {
        return `Hello, ${this.payload}`;
    }
}
