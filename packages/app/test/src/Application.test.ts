import HelloWorldRoute from "../../../test/src/actions/HelloWorldRoute";
import {MainContext} from "../../../test/src/context/MainContext";
import {Application} from "../../src";

test("Application", async () => {
    const app = await Application.factory(() => new MainContext(), []);
    expect(app).toBeInstanceOf(Application);
    expect(app.size).toBe(0);
    app.add(HelloWorldRoute);

    expect(app.size).toBe(1);
    expect(() => app.add(HelloWorldRoute)).toThrow();

    app.remove(HelloWorldRoute);
    expect(app.size).toBe(0);
});
