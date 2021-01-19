import {Action} from "../../../unit";
import {assert} from "../../../util";
import {IBaseContext} from "../context/BaseContext";

export class NeverRunAction extends Action<IBaseContext> {
    public run(): void {
        assert(false, "This method shouldn't run");
    }
}
