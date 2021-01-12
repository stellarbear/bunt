import {promises} from "fs";
import {basename, join} from "path";
import {Resource} from "./Resource";

const {stat, copyFile} = promises;

export class ResourceStore {
    public readonly current: string;
    public readonly location: string;

    constructor(location: string) {
        this.location = location;
        this.current = process.cwd();
    }

    public async getResource(file: string): Promise<Resource> {
        return new Resource(this, file, await this.resolve(file));
    }

    public async writeToPackageRoot(resource: Resource): Promise<string> {
        try {
            await stat(join(this.current, "package.json"));
        } catch {
            throw Error(`Wrong path ${this.current}, package.json not found`);
        }

        const path = join(this.current, basename(resource.file));
        await copyFile(resource.path, path);

        return path;
    }

    protected async resolve(file: string): Promise<string> {
        const path = join(this.location, file);
        await stat(path);

        return path;
    }
}
