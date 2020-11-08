import {isString} from "@typesafeunit/util";
import {ScalarType} from "./ScalarType";

export const Text = new ScalarType<string, string>({
    name: "Text",
    validate(payload) {
        this.assert(isString(payload), `Wrong payload: ${this.name} expected`, payload);
        return payload;
    },
});
