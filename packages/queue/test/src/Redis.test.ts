import {Disposer} from "@typesafeunit/unit";
import {assert, createAsyncTimeout} from "@typesafeunit/util";
import {Queue, RedisTransport, serialize} from "../../src";
import {createConnection} from "../../src/Redis/fn";
import {BarMessage} from "./Message/BarMessage";
import {TestTransaction} from "./Message/TestTransaction";

const watch = async <T>(expected: T, fn: () => Promise<T>) => {
    while (true) {
        if (expected === await fn()) {
            return;
        }

        await createAsyncTimeout(100);
    }
};

describe.skip("Redis", () => {
    const redis = createConnection();
    afterAll(async () => {
        await redis.flushall();
        await redis.disconnect();
    });

    test("Q1", async () => {
        const res: number[] = [];
        const queue = new Queue(new RedisTransport());
        const messages = [new BarMessage(1), new BarMessage(2), new BarMessage(3)];

        queue.subscribe(BarMessage, ({payload}) => res.push(payload));
        messages.map((message) => queue.send(message));

        await watch(3, async () => res.length);
        expect(res).toEqual([1, 2, 3]);

        await Disposer.dispose(queue);
    });

    test("Q2", async () => {
        const res: any[] = [];
        const queue = new Queue(new RedisTransport());
        queue.subscribe(TestTransaction, async ({payload}) => {
            res.push(payload);
            res.push(await redis.lrange(TestTransaction.getBackupKey(), 0, 1));
            assert(payload === 1);
        });

        queue.send(new TestTransaction(1));
        queue.send(new TestTransaction(2));
        await watch(4, async () => res.length);

        res.push(await redis.lrange(TestTransaction.getFallbackKey(), 0, 1));

        expect(res).toEqual([
            1,
            [serialize(new TestTransaction(1))],
            2,
            [serialize(new TestTransaction(2))],
            [serialize(new TestTransaction(2))],
        ]);

        await Disposer.dispose(queue);
    });
});
