import {Action} from "../../../unit";
import {assert} from "../../../util";
import {IBaseContext} from "../interfaces";

export class TestExceptionAction extends Action<IBaseContext, { error: string }> {
    public run(): void {
        assert(false, this.state.error);
    }
}
