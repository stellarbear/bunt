type TMap = Map<string, any>;

const storage = new Map<string, TMap>();

export class MemoryDb {
    public readonly prefix: string;
    public readonly ref: TMap;

    protected constructor(ref: TMap, prefix: string) {
        this.ref = ref;
        this.prefix = prefix;
    }

    public static async connect(prefix = "db"): Promise<MemoryDb> {
        const map = storage.get(prefix) || new Map();
        if (!storage.has(prefix)) {
            storage.set(prefix, map);
        }

        return new this(map, prefix);
    }

    public get(key: string): any {
        return this.ref.get(key);
    }

    public set(key: string, value: unknown): void {
        this.ref.set(key, value);
    }

    public delete(key: string): void {
        this.ref.delete(key);
    }

    public entries(): IterableIterator<[string, any]> {
        return this.ref.entries();
    }

    public deleteAll(): void {
        this.ref.clear();
    }
}
