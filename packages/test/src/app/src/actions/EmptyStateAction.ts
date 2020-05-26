import {Action} from "@typesafeunit/unit";

export class EmptyStateAction extends Action {
    public run(): void {
        return;
    }
}
