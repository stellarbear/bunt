import {ApplyContext} from "@bunt/unit";
import {Context, resolve} from "../../../unit";
import {MemoryDbServiceResolver} from "./services/MemoryDbServiceResolver";

export class BaseContext extends Context {
    public version = "1.0.0";
    public startAt = new Date();

    @resolve
    public get parentDb(): MemoryDbServiceResolver {
        return new MemoryDbServiceResolver("parent");
    }
}

export type IBaseContext = ApplyContext<BaseContext>;
