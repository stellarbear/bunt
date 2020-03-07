import {Application} from "@typesafeunit/app";
import {MainContext} from "../unit/src/context/MainContext";
import HelloWorldRoute from "./src/actions/HelloWorldRoute";

test("Application", async () => {
    const createContext = () => new MainContext();
    const app = await Application.factory(createContext);
    expect(app).toBeInstanceOf(Application);
    expect(app.size).toBe(0);
    app.add(HelloWorldRoute);

    expect(app.size).toBe(1);
    expect(() => app.add(HelloWorldRoute)).toThrow();

    app.remove(HelloWorldRoute);
    expect(app.size).toBe(0);
});
