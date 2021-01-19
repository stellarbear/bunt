import {Action} from "../../../unit";
import {assert} from "../../../util";
import {IBaseContext} from "../context/BaseContext";

export class TestExceptionAction extends Action<IBaseContext, { error: string }> {
    public run(): void {
        assert(false, this.state.error);
    }
}
