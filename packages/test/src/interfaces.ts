import {MemoryDb} from "./context/services/MemoryDb";

export interface IBaseContext {
    readonly version: string;
}

export interface IResolveAsyncContext extends IBaseContext {
    readonly memoryDb: MemoryDb;
    readonly randomBytes: Buffer;
}
