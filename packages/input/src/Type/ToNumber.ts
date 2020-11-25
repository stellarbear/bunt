import {isNumber, isString, MayNullable, Promisify} from "@typesafeunit/util";
import {SuperType} from "../SuperType";

export class ToNumber extends SuperType<number | string, number, number | string, number> {
    public validate(payload: MayNullable<number | string>): Promisify<number> {
        this.assert(isNumber(payload) || isString(payload), `Wrong payload type`, payload);
        return this.type.validate(+payload);
    }
}
