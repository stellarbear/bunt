import {isNumber} from "@typesafeunit/util";
import {ScalarType} from "./ScalarType";

export const Int = new ScalarType<number, number>({
    name: "Int",
    validate(payload) {
        this.assert(isNumber(payload), `Wrong payload: ${this.name} expected`, payload);
        return payload;
    },
});
