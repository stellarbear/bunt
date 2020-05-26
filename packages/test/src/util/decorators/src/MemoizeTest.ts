import {memoize} from "@typesafeunit/util";

export class MemoizeTest {
    @memoize
    public static test(): number {
        return Math.random();
    }
}
