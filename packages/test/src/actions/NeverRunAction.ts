import {Action} from "../../../unit";
import {assert} from "../../../util";

export class NeverRunAction extends Action {
    public run(): void {
        assert(false, "This method shouldn't run");
    }
}
