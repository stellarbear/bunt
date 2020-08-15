import {Application, PathRoute} from "@typesafeunit/app";
import {Runtime} from "@typesafeunit/unit";
import {debugLogFormat, Logger, StdErrorTransport, StdOutTransport} from "@typesafeunit/util";
import {CorsValidation, Server} from "@typesafeunit/web";
import {BaseTestAction} from "./actions/BaseTestAction";
import {BaseContext} from "./context/BaseContext";

async function main() {
    const app = await Application.factory(new BaseContext(), [
        new PathRoute(BaseTestAction, {route: "GET /test", state: () => ({name: "test"})}),
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
