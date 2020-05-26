import {Action} from "@typesafeunit/unit";
import {IBaseContext} from "../interfaces";

export class BaseTestAction extends Action<IBaseContext, { name: string }> {
    public run(): string {
        return `Hello, ${this.state.name}!`;
    }
}
