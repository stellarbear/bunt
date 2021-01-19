import {assert} from "@bunt/util";
import {IResponder, RouteResponse} from "../interfaces";
import {RequestMessageAbstract} from "./RequestMessageAbstract";

export abstract class ResponderAbstract extends RequestMessageAbstract implements IResponder {
    #complete = false;

    public get complete(): boolean {
        return this.#complete;
    }

    public async respond(response: RouteResponse): Promise<void> {
        assert(!this.complete, `Response was already sent`);
        try {
            await this.write(response);
        } finally {
            this.#complete = true;
        }
    }

    protected abstract write(response: RouteResponse): Promise<void>;
}
