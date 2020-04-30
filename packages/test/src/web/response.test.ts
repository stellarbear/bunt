import {JSONResponse, Response} from "@typesafeunit/web";

describe("Response", () => {
    test("Main", () => {
        const resp = new Response("", {code: 200, status: "Hello", headers: {"foo": "123"}});
        expect(resp.getContentType()).toMatchSnapshot();
        expect(resp.getHeaders()).toMatchSnapshot();
    });

    test("JSON", () => {
        const resp = new JSONResponse({foo: "bar"}, {code: 200});
        expect(resp.getContentType()).toMatchSnapshot();
        expect(resp.getHeaders()).toMatchSnapshot();
        expect(resp.stringify()).toMatchSnapshot();
    });
});
