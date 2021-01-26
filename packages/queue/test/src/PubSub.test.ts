import {Disposer} from "@bunt/unit";
import {RedisTransport} from "../../src";
import {PubSubChannel} from "../../src/PubSub/interfaces";
import {PubSubSimple} from "../../src/PubSub/PubSubSimple";

describe.skip("PubSub", () => {
    test("Main", async () => {
        const channel: PubSubChannel<any> = ["foo", 1];
        const transport = new RedisTransport("redis://127.0.0.1:6379");
        const pubSub = new PubSubSimple(transport);
        const subscribe = await pubSub.subscribe(channel);
        const iterator = subscribe[Symbol.asyncIterator]();
        await expect(pubSub.publish(channel, "bar")).resolves.not.toThrow();
        await expect(iterator.next()).resolves.toEqual({value: "bar", done: false});
        return Disposer.dispose(pubSub);
    });
});
