import {JSONResponse, NoContentResponse, Redirect} from "../../src";
import * as HTTP from "http-status";

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

    test("Redirect", () => {
        const redirect = new Redirect("/redirect");
        expect(redirect.code).toBe(HTTP["MOVED_PERMANENTLY"]);
        expect(redirect.status).toBe(HTTP["301"]);
        expect(redirect.getHeaders()).toMatchSnapshot();

        expect(() => new Redirect("/", 500)).toThrow();
    });
});
