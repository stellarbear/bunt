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

        await app.handle(request);
        expect(request).toMatchSnapshot();

        const wrongRequest = new Request(
            "/u/123",
            headers,
            JSON.stringify({}),
        );

        await expect(app.handle(wrongRequest))
            .rejects
            .toThrow("HelloWorldAction validation failed");
    });

    test("Not found", async () => {
        const app = await Application.factory(new MainContext());
        const request = new Request("/wrong-uri", {});
        await expect(app.handle(request)).rejects.toThrow(RouteNotFound);
        expect(request.response).toBeInstanceOf(RouteNotFound);
        expect(request).toMatchSnapshot();
    });
});
