import {Application, Resolver, RouteRule} from "@typesafeunit/app";
import {Fields, Text} from "@typesafeunit/input";
import {BaseTestAction} from "../../../test/src/actions/BaseTestAction";
import {BaseContext} from "../../../test/src/context/BaseContext";
import {RequestCommand} from "../../src";
import {command} from "./command";

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
