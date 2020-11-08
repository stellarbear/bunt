import {isBoolean} from "@typesafeunit/util";
import {ScalarType} from "./ScalarType";

export const Bool = new ScalarType<boolean, boolean>({
    name: "Bool",
    validate(payload) {
        this.assert(isBoolean(payload), `Wrong payload: ${this.name} expected`, payload);
        return payload;
    },
});
