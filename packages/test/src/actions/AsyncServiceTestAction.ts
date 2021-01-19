import {Action} from "../../../unit";
import {IMainContext} from "../context/MainContext";

export class AsyncServiceTestAction extends Action<IMainContext, { key: string }> {
    public async run(): Promise<string> {
        const {key} = this.state;
        const {memoryDb, randomBytes} = this.context;
        const value = randomBytes.toString("hex");
        memoryDb.set(key, value);

        return value;
    }
}
