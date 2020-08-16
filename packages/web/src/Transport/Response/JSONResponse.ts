import {ResponseAbstract} from "./ResponseAbstract";

export class JSONResponse extends ResponseAbstract<any> {
    public readonly type = "application/json";

    public stringify(data: any): string {
        return JSON.stringify(data);
    }
}
