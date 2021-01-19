import {Action} from "@bunt/unit";
import {IBaseContext} from "../context/BaseContext";

export class BaseTestAction extends Action<IBaseContext, { name: string }> {
    public run(): string {
        return `Hello, ${this.state.name}!`;
    }
}
