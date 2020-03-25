import {TextResponse} from "./TextResponse";

export class HTMLResponse extends TextResponse {
    public readonly type = "text/html";
}
