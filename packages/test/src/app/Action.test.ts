import {Application} from "@typesafeunit/app";
import {NotFound} from "@typesafeunit/app/dist/Error/NotFound";
import {MainContext} from "../unit/src/context/MainContext";
import HelloWorldRoute from "./src/actions/HelloWorldRoute";
import {Request} from "./src/transport/Request";
import {Transport} from "./src/transport/Transport";

describe("Route", () => {
    const headers = {"Content-Type": "application/json"};

    test("Success", async () => {
        const app = await Application.factory(new MainContext());
        app.add(HelloWorldRoute);

        const request = new Request(
            "/u/123",
            headers,
            JSON.stringify({name: "World"}),
        );

        const transport = new Transport(request);
        await app.handle(transport);
        expect(transport).toMatchSnapshot();

        const wrongRequest = new Request(
            "/u/123",
            headers,
            JSON.stringify({}),
        );

        await expect(app.handle(new Transport(wrongRequest)))
            .rejects
            .toThrow("HelloWorldAction validation failed");
    });

    test("Not found", async () => {
        const app = await Application.factory(new MainContext());
        const request = new Request("/wrong-uri", {});
        const transport = new Transport(request);
        await app.handle(transport);
        expect(transport.response).toBeInstanceOf(NotFound);
        expect(transport).toMatchSnapshot();
    });
});
