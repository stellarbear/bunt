import {Resolver, RouteRule} from "@bunt/app";
import {Fields, Text} from "@bunt/input";
import {Runtime} from "@bunt/unit";
import {debugLogFormat, Logger, StdErrorTransport, StdOutTransport} from "@bunt/util";
import {CorsValidation, WebServer} from "@bunt/web";
import {BaseTestAction} from "./actions/BaseTestAction";
import {BaseContext} from "./context/BaseContext";
import {pathRoute} from "./route";

async function main() {
    const routes = [
        pathRoute(BaseTestAction, new RouteRule(
            "GET /test",
            new Fields({name: Text}),
            new Resolver({name: () => "test"}),
        )),
    ];

    const validators = new CorsValidation({});
    const server = await WebServer.factory(new BaseContext(), routes, {validators});
    return server.listen(10000);
}

Runtime.initialize(() => {
    Logger.set([
        new StdErrorTransport(debugLogFormat),
        new StdOutTransport(debugLogFormat),
    ]);
});

Runtime.run(main);
