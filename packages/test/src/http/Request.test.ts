import {JSONTransform, URLEncodedFormTransform} from "@typesafeunit/app";
import {Request} from "./src/transport/Request";

describe("Request", () => {
    test("JSONTransform", async () => {
        const request = new Request(
            "/u/123",
            {"Content-Type": "application/json"},
            JSON.stringify({field1: "Value1", num: 123}),
        );

        expect(await JSONTransform(request))
            .toMatchSnapshot();
    });

    test("FormTransform", async () => {
        const request = new Request(
            "/u/123",
            {"Content-Type": "application/json"},
            "key=value&foo=bar",
        );

        expect(await URLEncodedFormTransform(request))
            .toMatchSnapshot();
    });
});
