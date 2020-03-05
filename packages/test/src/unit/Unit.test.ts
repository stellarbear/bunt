import {unit, Unit} from "@typesafeunit/unit";
import {BaseTestAction} from "./src/actions/BaseTestAction";
import {NeverRunAction} from "./src/actions/NeverRunAction";
import {ProfileTestAction} from "./src/actions/ProfileTestAction";
import {TestExceptionAction} from "./src/actions/TestExceptionAction";
import {BaseContext} from "./src/context/BaseContext";

test("Unit", async () => {
    const buffer: any[] = [];
    const app = await unit(new BaseContext());
    const profiler = app.getProfiler()
        .listen((type, event) => buffer.push([type, event]));

    expect(await Unit.factory(new BaseContext())).toBeInstanceOf(Unit);
    expect(await Unit.factory(() => new BaseContext())).toBeInstanceOf(Unit);

    await expect(app.run(NeverRunAction)).rejects.toThrow();
    expect(app.has(BaseTestAction)).toBe(false);
    expect(app.add(BaseTestAction)).toEqual([BaseTestAction]);
    expect(app.has(BaseTestAction)).toBe(true);

    const name = Date.now().toString(32);

    const helloWorldRun: string = await app.run(BaseTestAction, {name});
    expect(helloWorldRun).toBe(`Hello, ${name}!`);
    expect(buffer).toMatchSnapshot();
    buffer.length = 0;

    profiler.enable();
    app.add(ProfileTestAction);
    await app.run(ProfileTestAction);
    expect(buffer).toMatchSnapshot();
    buffer.length = 0;

    const error = "Should thrown the Error";
    app.add(TestExceptionAction);
    await expect(app.run(TestExceptionAction, error))
        .rejects
        .toThrow(error);

    expect(buffer).toMatchSnapshot();
    profiler.disable();
});
