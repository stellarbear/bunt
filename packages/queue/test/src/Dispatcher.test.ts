import {Context, Disposer} from "@bunt/unit";
import {wait} from "../../../util/src";
import {Queue} from "../../src";
import {Dispatcher} from "../../src/Dispatcher";
import {HelloAsk} from "./Dispatcher/HelloAsk";
import {HelloHandler} from "./Dispatcher/HelloHandler";
import {HelloReply} from "./Dispatcher/HelloReply";
import {TestTransport} from "./Queue/TestTransport";

describe("Dispatcher", () => {
    const queue = new Queue(new TestTransport());
    test("Test", async () => {
        const dispatcher = await Dispatcher.factory(queue, new Context());
        dispatcher.subscribe(HelloAsk, HelloHandler);

        queue.send(new HelloAsk("Test"));
        const reply = await wait<string>((resolve) => queue.subscribe(HelloReply, ({payload}) => {
            resolve(payload);
        }));

        expect(reply).toBe("Hello, Test");

        const heartbeat = dispatcher.getHeartbeat();
        await Disposer.dispose(dispatcher);

        await expect(heartbeat.waitUntilStop()).resolves.toBeUndefined();
    });
});
