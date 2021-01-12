import {ResourceStore} from "./ResourceStore";

export class Resource {
    public readonly file: string;
    public readonly path: string;

    readonly #store: ResourceStore;

    constructor(store: ResourceStore, file: string, path: string) {
        this.#store = store;
        this.file = file;
        this.path = path;
    }
}
