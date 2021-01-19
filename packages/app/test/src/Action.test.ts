import {Application, RouteNotFound} from "../../src";
import HelloWorldRoute from "./action/HelloWorldRoute";
import {BaseContext} from "./context/BaseContext";
import {Request} from "./transport/Request";

describe("Route", () => {
    const headers = {"Content-Type": "application/json"};

    test("Success", async () => {
        const app = await Application.factory(new BaseContext(), [HelloWorldRoute]);
        const request = new Request(
            "/u/123",
            headers,
            JSON.stringify({name: "World"}),
        );

        try {
            const response = await app.run(request);
            expect({request, response}).toMatchSnapshot();
        } catch (error) {
            console.log(error.toSafeJSON());
        }
    });

    test("Fails", async () => {
        const app = await Application.factory(new BaseContext(), [HelloWorldRoute]);
        const wrongRequest = new Request(
            "/u/123",
            headers,
            JSON.stringify({}),
        );

        await expect(app.run(wrongRequest))
            .rejects
            .toThrow("Assertion failed");
    });

    test("Not found", async () => {
        const app = await Application.factory(new BaseContext());
        const request = new Request("/wrong-uri", {});
        await expect(app.run(request)).rejects.toThrowError(RouteNotFound);
    });
});
