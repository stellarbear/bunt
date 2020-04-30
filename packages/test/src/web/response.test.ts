import {JSONResponse, NoContentResponse} from "@typesafeunit/web";

describe("Response", () => {
    test("Main", () => {
        const resp = new NoContentResponse({headers: {"foo": "123"}});
        expect(resp.getContentType()).toMatchSnapshot();
        expect(resp.getHeaders()).toMatchSnapshot();
        expect(resp.code).toBe(204);
    });

    test("JSON", () => {
        const resp = new JSONResponse({foo: "bar"}, {code: 200});
        expect(resp.getContentType()).toMatchSnapshot();
        expect(resp.getHeaders()).toMatchSnapshot();
        expect(resp.stringify()).toMatchSnapshot();
        expect(resp.code).toBe(200);
    });
});
