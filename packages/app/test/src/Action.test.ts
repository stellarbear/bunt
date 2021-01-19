import HelloWorldRoute from "../../../test/src/actions/HelloWorldRoute";
import {MainContext} from "../../../test/src/context/MainContext";
import {Request} from "../../../test/src/transport/Request";
import {Application, RouteNotFound} from "../../src";

describe("Route", () => {
    const headers = {"Content-Type": "application/json"};

    test("Success", async () => {
        const app = await Application.factory(new MainContext(), [HelloWorldRoute]);
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
        const app = await Application.factory(new MainContext(), [HelloWorldRoute]);
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
        const app = await Application.factory(new MainContext());
        const request = new Request("/wrong-uri", {});
        await expect(app.run(request)).rejects.toThrowError(RouteNotFound);
    });
});
