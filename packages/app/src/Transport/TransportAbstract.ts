import {assert} from "@typesafeunit/util";
import {IRequest, RouteResponse} from "../interfaces";

const sent = Symbol();

export abstract class TransportAbstract {
    public abstract readonly request: IRequest;
    protected [sent] = false;

    public get sent() {
        return this[sent];
    }

    public async respond(response: RouteResponse) {
        assert(!this.sent, `Response was already sent`);
        try {
            await this.write(response);
        } finally {
            this[sent] = true;
        }
    }

    protected abstract write(response: RouteResponse): Promise<void>;
}
