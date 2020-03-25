import {ResponseAbstract} from "./ResponseAbstract";

export class JSONResponse extends ResponseAbstract<any> {
    public readonly type = "application/json";

    public stringify() {
        return JSON.stringify(this.data);
    }
}
