import {Application, UniqueRoute} from "@typesafeunit/app";
import {BaseTestAction} from "../../../test/src/actions/BaseTestAction";
import {BaseContext} from "../../../test/src/context/BaseContext";
import {RequestCommand} from "../../src";

test("Command Test", async () => {
    const baseTestCommand = new UniqueRoute(BaseTestAction, {route: "test", state: () => ({name: "test"})});

    const app = await Application.factory(new BaseContext(), [baseTestCommand]);
    expect(() => app.run(new RequestCommand())).toThrow();
    expect(await app.run(new RequestCommand("test"))).toBe("Hello, test!");
});
