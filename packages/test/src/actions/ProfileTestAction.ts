import {Action} from "../../../unit";
import {IBaseContext} from "../interfaces";

export class ProfileTestAction extends Action<IBaseContext> {
    public run(): boolean {
        return true;
    }
}
