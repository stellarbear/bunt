import {MemoizeTest} from "./src/MemoizeTest";

test("memoize", () => {
    expect(MemoizeTest.test()).toBe(MemoizeTest.test());
});
