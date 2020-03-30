import {Argv} from "@typesafeunit/util";

describe("Cli", () => {
    const argv = ["-f", "!-not", "--kv=value", "--port=123", "argument1", "argument2"];

    test("Parser should work", () => {
        const args = new Argv(argv);
        expect({...args}).toEqual({
            flags: new Map(Object.entries({f: true, not: false})),
            options: new Map(Object.entries({kv: "value", port: "123"})),
            args: new Set(["argument1", "argument2"]),
        });
    });

    test("Options normalization should work", () => {
        const args = new Argv(argv);
        expect(args.getOption("port", 80)).toBe(123);
    });
});
