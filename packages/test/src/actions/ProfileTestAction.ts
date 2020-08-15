import {Action, ActionHooks} from "../../../unit";
import {noop} from "../../../util";
import {IBaseContext} from "../interfaces";

export class ProfileTestAction extends Action<IBaseContext> {
    public static get hooks(): ActionHooks<ProfileTestAction> {
        return {
            fails: noop,
            success: noop,
            validate: (s) => s,
            create: noop,
        } as ActionHooks<ProfileTestAction>;
    }

    public run(): boolean {
        return true;
    }
}
