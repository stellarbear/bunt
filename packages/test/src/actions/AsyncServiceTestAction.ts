import {Action} from "../../../unit";
import {IResolveAsyncContext} from "../interfaces";

export class AsyncServiceTestAction extends Action<IResolveAsyncContext, { key: string }> {
    public async run(): Promise<string> {
        const {key} = this.state;
        const {memoryDb, randomBytes} = this.context;
        const value = randomBytes.toString("hex");
        memoryDb.set(key, value);

        return value;
    }
}
