import {Action, ActionHooks} from "@typesafeunit/unit";
import {assert, noop} from "@typesafeunit/util";
import {IBaseContext} from "../interfaces";

export class TestExceptionAction extends Action<IBaseContext, string> {
    public static get hooks(): ActionHooks<TestExceptionAction> {
        return {
            fails: noop,
            success: noop,
            validate: (s) => s,
            create: noop,
        };
    }

    public run() {
        assert(false, this.state);
    }
}
