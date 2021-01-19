import {Action, IContext} from "../../../unit";

export class EmptyStateAction extends Action<IContext> {
    public run(): void {
        return;
    }
}
