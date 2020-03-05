import {IKeyValueReadonlyMap} from "../interfaces";
import {KeyValueMap} from "./KeyValueMap";

export class KeyValueReadonlyMap extends KeyValueMap implements IKeyValueReadonlyMap {
    declare delete: never;
    declare set: never;
}

Reflect.defineProperty(KeyValueReadonlyMap.prototype, "set", {value: undefined});
Reflect.defineProperty(KeyValueReadonlyMap.prototype, "delete", {value: undefined});
