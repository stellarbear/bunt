import {Payload} from "@bunt/app";
import TestInputStateValidationRoute, {resolver, type} from "../../../test/src/actions/TestInputStateValidationRoute";
import {MainContext} from "../../../test/src/context/MainContext";
import {Request} from "../../../test/src/transport/Request";
import {Application} from "../../src";

describe("Route", () => {
    const bd = new Date("2020-11-08T12:18:06.051Z").toISOString();
    const headers = {"Content-Type": "application/json", "Authorization": "s5sChdDmOPmFLtEEsq4L"};
    const request = new Request("/test", headers, JSON.stringify({bd, name: "Peter"}));
    const failRequest = new Request("/test", headers, JSON.stringify({}));

    test("Payload", async () => {
        const payload = new Payload(type, resolver);
        const context = {request, args: new Map<string, string>(Object.entries(headers)), context: {}};
        await expect(payload.validate(context))
            .resolves
            .toMatchSnapshot();
    });

    test("Success", async () => {
        const app = await Application.factory(new MainContext(), [TestInputStateValidationRoute]);
        const response = await app.run(request);
        expect({response, request}).toMatchSnapshot();
    });

    test("Fails", async () => {
        const app = await Application.factory(new MainContext(), [TestInputStateValidationRoute]);
        await expect(app.run(failRequest)).rejects.toMatchSnapshot();
    });
});
