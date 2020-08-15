import {RunnableTest} from "../../../test/src/runnable/RunnableTest";

describe("Test Runnable pattern", () => {
    test("should beats until stop", async () => {
        const runnable = new RunnableTest();
        const heartbeat = runnable.getHeartbeat();
        expect(heartbeat.beats).toBe(true);
        runnable.destroy();

        expect(await heartbeat.waitUntilStop()).toBe(true);
    });

    test("should beats until crashes", async () => {
        const runnable = new RunnableTest();
        const heartbeat = runnable.getHeartbeat();
        expect(heartbeat.beats).toBe(true);
        runnable.crash();

        await expect(heartbeat.waitUntilStop()).resolves.toThrow();
    });
});
