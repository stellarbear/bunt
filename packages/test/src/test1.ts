import {Application, Resolver, RouteRule} from "@bunt/app";
import {Fields, Text} from "@bunt/input";
import {Runtime} from "@bunt/unit";
import {debugLogFormat, Logger, StdErrorTransport, StdOutTransport} from "@bunt/util";
import {CorsValidation, Server} from "@bunt/web";
import {BaseTestAction} from "./actions/BaseTestAction";
import {BaseContext} from "./context/BaseContext";
import {pathRoute} from "./route";

async function main() {
    const app = await Application.factory(new BaseContext(), [
        pathRoute(BaseTestAction, new RouteRule(
            "GET /test",
            new Fields({name: Text}),
            new Resolver({name: () => "test"}),
        )),
    ]);

    const validators = CorsValidation.factory(app);
    const server = new Server(app, {validators});
    return server.listen(10000);
}

Runtime.initialize(() => {
    Logger.set([
        new StdErrorTransport(debugLogFormat),
        new StdOutTransport(debugLogFormat),
    ]);
});

Runtime.run(main);
