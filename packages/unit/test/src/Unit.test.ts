import {unit, Unit} from "@bunt/unit";
import {BaseTestAction} from "../../../test/src/actions/BaseTestAction";
import {NeverRunAction} from "../../../test/src/actions/NeverRunAction";
import {ProfileTestAction} from "../../../test/src/actions/ProfileTestAction";
import {TestExceptionAction} from "../../../test/src/actions/TestExceptionAction";
import {BaseContext} from "../../../test/src/context/BaseContext";

test("Unit", async () => {
    const app = await unit(new BaseContext());

    expect(await Unit.factory(new BaseContext())).toBeInstanceOf(Unit);
    expect(await Unit.factory(() => new BaseContext())).toBeInstanceOf(Unit);

    await expect(app.run(NeverRunAction)).rejects.toThrow();
    expect(app.has(BaseTestAction)).toBe(false);
    expect(app.add(BaseTestAction)).toEqual([BaseTestAction]);
    expect(app.has(BaseTestAction)).toBe(true);

    const name = Date.now().toString(32);
    const helloWorldRun: string = await app.run(BaseTestAction, {name});
    expect(helloWorldRun).toBe(`Hello, ${name}!`);

    app.add(ProfileTestAction);
    await app.run(ProfileTestAction);

    const error = "Should thrown the Error";
    app.add(TestExceptionAction);
    await expect(app.run(TestExceptionAction, {error}))
        .rejects.toThrow(error);
});
