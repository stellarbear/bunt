import {isBoolean, isFunction, assert} from "@typesafeunit/util";
import {HeaderAssertValue, IHeaders} from "../interfaces";
import {KeyValueReadonlyMap} from "./KeyValueReadonlyMap";

export abstract class HeadersAbstract extends KeyValueReadonlyMap implements IHeaders {
    public assert(header: string, expected: HeaderAssertValue): void {
        const clientValue = this.get(header);
        if (Array.isArray(expected)) {
            assert(
                expected.some((value) => value === clientValue),
                `Wrong header "${header}" value, allowed: ${expected.join(", ")}`,
            );
        }

        if (isFunction(expected)) {
            const result = expected(clientValue);
            if (isBoolean(result)) {
                assert(result, `Wrong ${header}`);
            }
        }
    }
}
