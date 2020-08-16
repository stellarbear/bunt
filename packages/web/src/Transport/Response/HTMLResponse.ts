import {TextPlainResponse} from "./TextPlainResponse";

export class HTMLResponse extends TextPlainResponse {
    public readonly type = "text/html";
}
