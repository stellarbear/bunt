import {FsBucket, IBucketOptions} from "./Bucket/FsBucket";
import {FsBucketList} from "./Bucket/FsBucketList";
import {FsDriverAbstract} from "./Driver/FsDriverAbstract";

export class FileStorage {
    readonly #driver: FsDriverAbstract;
    readonly #buckets: FsBucketList;

    constructor(driver: FsDriverAbstract) {
        this.#driver = driver;
        this.#buckets = new FsBucketList(this);
    }

    public getBucket(name: string, options: IBucketOptions = {}): FsBucket {
        return this.#buckets.ensure(name, options);
    }

    public getDriver(): FsDriverAbstract {
        return this.#driver;
    }
}
