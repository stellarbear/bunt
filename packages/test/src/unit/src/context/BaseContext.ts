import {Context, resolve} from "@typesafeunit/unit";
import {MemoryDbServiceResolver} from "./services/MemoryDbServiceResolver";

export class BaseContext extends Context {
    public version = "1.0.0";
    public startAt = new Date();

    @resolve
    public get parentDb() {
        return new MemoryDbServiceResolver("parent");
    }
}
