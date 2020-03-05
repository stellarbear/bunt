type TMap = Map<string, any>;

const storage = new Map<string, TMap>();

export class MemoryDb {
    public readonly prefix: string;
    public readonly ref: TMap;

    protected constructor(ref: TMap, prefix: string) {
        this.ref = ref;
        this.prefix = prefix;
    }

    public static async connect(prefix = "db") {
        const map = storage.get(prefix) || new Map();
        if (!storage.has(prefix)) {
            storage.set(prefix, map);
        }

        return new this(map, prefix);
    }

    public get(key: string) {
        return this.ref.get(key);
    }

    public set(key: string, value: any) {
        this.ref.set(key, value);
    }

    public delete(key: string) {
        this.ref.delete(key);
    }

    public entries() {
        return this.ref.entries();
    }

    public deleteAll() {
        this.ref.clear();
    }
}
