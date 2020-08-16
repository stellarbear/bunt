import {ResponseAbstract} from "./ResponseAbstract";

export class JSONResponse<T extends any> extends ResponseAbstract<T> {
    public readonly type = "application/json";

    public stringify(data: T): string {
        return JSON.stringify(data);
    }
}
