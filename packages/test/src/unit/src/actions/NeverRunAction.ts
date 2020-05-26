import {Action} from "@typesafeunit/unit";
import {assert} from "@typesafeunit/util";

export class NeverRunAction extends Action {
    public run(): void {
        assert(false, "This method shouldn't run");
    }
}
