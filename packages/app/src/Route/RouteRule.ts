import {FieldSelectType} from "@typesafeunit/input";
import {ActionState} from "@typesafeunit/unit";
import {RouteAction} from "../interfaces";
import {Payload, Resolver} from "../Payload";

export class RouteRule<A extends RouteAction> extends Payload<A> {
    public readonly route: string;

    constructor(route: string, type: FieldSelectType<ActionState<A>>, resolver: Resolver<A>) {
        super(type, resolver);
        this.route = route;
    }
}
