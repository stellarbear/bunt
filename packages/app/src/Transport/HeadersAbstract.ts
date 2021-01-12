import {assert, ILogable, isBoolean, isFunction} from "@bunt/util";
import {HeaderAssertValue, IHeaders} from "../interfaces";
import {KeyValueReadonlyMap} from "./KeyValueReadonlyMap";

export abstract class HeadersAbstract extends KeyValueReadonlyMap
    implements IHeaders, ILogable<{ [key: string]: string }> {
    constructor(values: [string, string][]) {
        super(values.map(([key, value]) => [key.toLowerCase(), value]));
    }

    public assert(header: string, expected: HeaderAssertValue): void {
        const clientValue = this.get(header.toLowerCase());
        if (Array.isArray(expected)) {
            assert(
                expected.some((e) => clientValue.includes(e)),
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
