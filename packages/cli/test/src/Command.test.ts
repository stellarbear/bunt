import {Application, Resolver, RouteRule} from "@bunt/app";
import {Fields, Text} from "@bunt/input";
import {RequestCommand} from "../../src";
import {BaseTestAction} from "./action/BaseTestAction";
import {command} from "./command";
import {BaseContext} from "./context/BaseContext";

test("Command Test", async () => {
    const baseTestCommand = command(BaseTestAction, new RouteRule(
        "test",
        new Fields({name: Text}),
        new Resolver({name: () => "test"}),
    ));

    const app = await Application.factory(new BaseContext(), [baseTestCommand]);
    expect(await app.run(new RequestCommand("test"))).toBe("Hello, test!");
    expect(() => app.run(new RequestCommand())).toThrow();
});
