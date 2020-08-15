import {Action, ActionHooks} from "../../../unit";
import {assert, noop} from "../../../util";
import {IBaseContext} from "../interfaces";

export class TestExceptionAction extends Action<IBaseContext, string> {
    public static get hooks(): ActionHooks<TestExceptionAction> {
        return {
            fails: noop,
            success: noop,
            validate: (s) => s,
            create: noop,
        } as ActionHooks<TestExceptionAction>;
    }

    public run(): void {
        assert(false, this.state);
    }
}
