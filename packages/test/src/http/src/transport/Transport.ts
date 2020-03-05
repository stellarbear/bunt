import {IRequest, RouteResponse, TransportAbstract} from "@typesafeunit/app";

export class Transport extends TransportAbstract {
    public readonly request: IRequest;
    public response?: RouteResponse;

    constructor(request: IRequest) {
        super();
        this.request = request;
    }

    protected write(response: RouteResponse): Promise<void> {
        this.response = response;
        return Promise.resolve();
    }
}
