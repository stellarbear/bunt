import {Service} from "@bunt/unit";
import {MemoryDb} from "./MemoryDb";

export class MemoryDbServiceResolver extends Service<MemoryDb> {
    protected readonly prefix: string;

    constructor(prefix: string) {
        super();
        this.prefix = prefix;
    }

    public async resolve(prefix?: string): Promise<MemoryDb> {
        return MemoryDb.connect(prefix || this.prefix);
    }
}
