import {Resolver, RouteRule} from "@bunt/app";
import {Bool, Fields, Int, Text, ToNumber} from "@bunt/input";
import {pathRoute} from "../route";
import {HelloWorldAction} from "./HelloWorldAction";

export default pathRoute(
    HelloWorldAction,
    new RouteRule(
        "/u/:id",
        () => new Fields({
            id: new ToNumber(Int),
            payload: new Fields({name: Text}),
            option: Bool,
        }),
        new Resolver({
            id: ({args}) => args.get("id"),
            payload: ({request}) => request.toObject(),
            option: () => false,
        }),
    ),
);
