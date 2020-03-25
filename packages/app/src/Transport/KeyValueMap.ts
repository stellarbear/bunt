import {IKeyValueMap} from "../interfaces";

const KEY_VALUE_MAP = Symbol();

export class KeyValueMap implements IKeyValueMap {
    protected readonly [KEY_VALUE_MAP]: Map<string, string>;

    constructor(values: [string, string][]) {
        this[KEY_VALUE_MAP] = new Map(values);
    }

    public delete(name: string): void {
        this[KEY_VALUE_MAP].delete(name);
    }

    public entries(): [string, string][] {
        return [...this[KEY_VALUE_MAP].entries()];
    }

    public get(name: string, defaultValue?: string): string {
        return this[KEY_VALUE_MAP].get(name) || defaultValue || "";
    }

    public has(name: string): boolean {
        return this[KEY_VALUE_MAP].has(name);
    }

    public set(name: string, value: string): void {
        this[KEY_VALUE_MAP].set(name, value);
    }

    public toObject(): { [p: string]: string } {
        const object: { [p: string]: string } = {};
        for (const [key, value] of this[KEY_VALUE_MAP].entries()) {
            object[key] = value;
        }

        return object;
    }


}
