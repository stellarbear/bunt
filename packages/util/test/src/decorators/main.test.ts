import {MemoizeTest} from "./src/MemoizeTest";

describe("Decorators", () => {
    test("memoize", () => {
        expect(MemoizeTest.test()).toBe(MemoizeTest.test());
    });
});
