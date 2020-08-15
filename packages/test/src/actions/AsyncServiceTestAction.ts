import {Action, ActionHooks} from "../../../unit";
import {assert, isString} from "../../../util";
import {IResolveAsyncContext} from "../interfaces";

export class AsyncServiceTestAction extends Action<IResolveAsyncContext, { key: string }> {
    public static get hooks(): ActionHooks<AsyncServiceTestAction> {
        return {
            validate: (schema) => schema.add("key", (v) => assert(isString(v))),
        } as ActionHooks<AsyncServiceTestAction>;
    }

    public async run(): Promise<string> {
        const {key} = this.state;
        const {memoryDb, randomBytes} = this.context;
        const value = randomBytes.toString("hex");
        memoryDb.set(key, value);

        return value;
    }
}
