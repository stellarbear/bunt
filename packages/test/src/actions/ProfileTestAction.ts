import {Action} from "../../../unit";
import {IBaseContext} from "../context/BaseContext";

export class ProfileTestAction extends Action<IBaseContext> {
    public run(): boolean {
        return true;
    }
}
