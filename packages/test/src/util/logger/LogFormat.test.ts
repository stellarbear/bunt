import {debugLogFormat, defaultLogFormat, SeverityLevel} from "@typesafeunit/util";

describe("Log format", () => {
    test("test default log formatter", () => {
        expect(defaultLogFormat({
            pid: 5761,
            label: "Test",
            message: "Log message",
            args: [1, {foo: "123"}],
            groupId: "groupId",
            host: "srv1",
            timestamp: 1585574245816,
            severity: SeverityLevel.DEBUG,
        })).toMatchSnapshot();
    });

    test("test debug log formatter", () => {
        expect(debugLogFormat({
            pid: 6611,
            label: "Test",
            message: "Log message",
            args: [1, {foo: "123"}],
            groupId: "G-7782",
            host: "srv2",
            timestamp: 1585574245816,
            severity: SeverityLevel.DEBUG,
        })).toMatchSnapshot();
    });
});
