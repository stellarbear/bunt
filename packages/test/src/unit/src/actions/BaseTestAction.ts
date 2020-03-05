import {Action} from "@typesafeunit/unit";
import {IBaseContext} from "../interfaces";

export class BaseTestAction extends Action<IBaseContext, { name: string }> {
    public run() {
        return `Hello, ${this.state.name}!`;
    }
}
