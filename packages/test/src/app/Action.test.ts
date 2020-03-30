import {Application} from "@typesafeunit/app";
import {RouteNotFound} from "@typesafeunit/app";
import {MainContext} from "../unit/src/context/MainContext";
import HelloWorldRoute from "./src/actions/HelloWorldRoute";
import {Request} from "./src/transport/Request";

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
        await app.handle(request);
        expect(request.response).toBeInstanceOf(RouteNotFound);
        expect(request).toMatchSnapshot();
    });
});
