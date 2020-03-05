import {Action, ActionHooks} from "@typesafeunit/unit";
import {noop} from "@typesafeunit/util";
import {IBaseContext} from "../interfaces";

export class ProfileTestAction extends Action<IBaseContext> {
    public static get hooks(): ActionHooks<ProfileTestAction> {
        return {
            fails: noop,
            success: noop,
            validate: (s) => s,
            create: noop,
        };
    }

    public run() {
        return true;
    }
}
