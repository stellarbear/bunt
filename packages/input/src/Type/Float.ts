import {isNumber} from "@typesafeunit/util";
import {ScalarType} from "./ScalarType";

export const Float = new ScalarType<number, number>({
    name: "Float",
    validate(payload) {
        this.assert(isNumber(payload), `Wrong payload: ${this.name} expected`, payload);
        return payload;
    },
});
