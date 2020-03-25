import {ResponseAbstract} from "./ResponseAbstract";

export class TextResponse extends ResponseAbstract<string> {
    public readonly type: string = "text/plain";

    public stringify() {
        return this.data;
    }
}
