#!/usr/bin/env node

import {Application} from "@bunt/app";
import {RequestCommand} from "@bunt/cli";
import {main, Runtime} from "@bunt/unit";
import {debugLogFormat, Logger, SeverityLevel, StdErrorTransport, StdOutTransport} from "@bunt/util";
import UpdateLintCommand from "./Command/UpdateLintCommand";
import {ProjectContext} from "./ProjectContext";

main(
    async () => {
        const commands = [
            UpdateLintCommand,
        ];

        const app = await Application.factory(new ProjectContext(), commands);
        return app.run(new RequestCommand());
    },
    () => {
        Logger.setSeverity(SeverityLevel.INFO);
        Logger.set([new StdErrorTransport(), new StdOutTransport()]);

        if (Runtime.isDebugEnable()) {
            Logger.setSeverity(SeverityLevel.DEBUG);
        }

        if (Runtime.isDevelopment()) {
            Logger.set([
                new StdErrorTransport(debugLogFormat),
                new StdOutTransport(debugLogFormat),
            ]);
        }
    },
);
