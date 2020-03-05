import {memoize} from "@typesafeunit/util";

export class MemoizeTest {
    @memoize
    public static test() {
        return Math.random();
    }
}
