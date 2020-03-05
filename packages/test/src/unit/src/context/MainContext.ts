import {Context, resolve} from "@typesafeunit/unit";
import * as crypto from "crypto";
import {BaseContext} from "./BaseContext";
import {MemoryDbServiceResolver} from "./services/MemoryDbServiceResolver";

export class MainContext extends BaseContext {
    protected readonly prefix = "db";

    @resolve
    public get memoryDb() {
        return new MemoryDbServiceResolver(this.prefix);
    }

    public get randomBytes() {
        return crypto.randomBytes(8);
    }

    public async getMemoryDb() {
        return Context.resolve(this.memoryDb);
    }
}
