import {Action} from "../../../src";
import {assert} from "@bunt/util";
import {IBaseContext} from "../context/BaseContext";

export class NeverRunAction extends Action<IBaseContext> {
    public run(): void {
        assert(false, "This method shouldn't run");
    }
}
