import {assert, compare, curry, ILogable, isBoolean, isFunction} from "@typesafeunit/util";
import {HeaderAssertValue, IHeaders} from "../interfaces";
import {KeyValueReadonlyMap} from "./KeyValueReadonlyMap";

export abstract class HeadersAbstract extends KeyValueReadonlyMap
    implements IHeaders, ILogable<{ [key: string]: string }> {
    constructor(values: [string, string][]) {
        super(values.map(([key, value]) => [key.toLowerCase(), value]));
    }

    public assert(header: string, expected: HeaderAssertValue): void {
        const clientValue = this.get(header.toLowerCase());
        const cmp = curry(compare, clientValue);
        if (Array.isArray(expected)) {
            assert(
                expected.some(cmp),
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

    public getLogValue(): Record<any, any> {
        return this.toJSON();
    }
}
