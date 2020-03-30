import {unit, Unit} from "@typesafeunit/unit";
import {BaseTestAction} from "./src/actions/BaseTestAction";
import {CreateValidationSchemaAction} from "./src/actions/CreateValidationSchemaAction";
import {NeverRunAction} from "./src/actions/NeverRunAction";
import {ProfileTestAction} from "./src/actions/ProfileTestAction";
import {TestExceptionAction} from "./src/actions/TestExceptionAction";
import {BaseContext} from "./src/context/BaseContext";

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

    const id = Math.random();
    app.add(CreateValidationSchemaAction);
    expect(await app.run(CreateValidationSchemaAction, {id})).toBe(id.toString(32));
    await expect(app.run(CreateValidationSchemaAction, {} as any))
        .rejects.toThrow("CreateValidationSchemaAction validation failed");

    app.add(ProfileTestAction);
    await app.run(ProfileTestAction);

    const error = "Should thrown the Error";
    app.add(TestExceptionAction);
    await expect(app.run(TestExceptionAction, error))
        .rejects.toThrow(error);
});
