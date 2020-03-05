import {assert} from "@typesafeunit/util";

test("assert", () => {
    expect(() => assert(false)).toThrow();
    expect(() => assert(true)).not.toThrow();
});
