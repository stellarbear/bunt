import {Application} from "@typesafeunit/app";
import {DisposableSync, IDestroyable, IDisposableSync, IRunnable} from "@typesafeunit/unit";
import {Heartbeat} from "@typesafeunit/unit/dist/Runtime/Heartbeat";
import {assert} from "@typesafeunit/util";
import * as http from "http";
import {Connection} from "./Connection";

export class Server implements IDisposableSync, IRunnable, IDestroyable {
    readonly [DisposableSync]: true;
    
    protected readonly server: http.Server;

    protected readonly application: Application<any, any>;

    constructor(application: Application<any, any>) {
        this.application = application;
        this.server = new http.Server();
    }

    public getHeartbeat() {
        return new Heartbeat((resolve) => this.server.once("close", resolve));
    }

    public listen(port: number) {
        assert(!this.server.listening, "Server already in listening mode");

        this.server.on(
            "request",
            async (req, res) => {
                try {
                    await this.application.handle(new Connection(req, res));
                } catch (error) {
                    console.error(error);
                    if (!res.headersSent) {
                        res.writeHead(500, "Internal Server Error");
                    }
                } finally {
                    res.writable && res.end();
                }
            })
            .listen(port);

        return this;
    }

    public async dispose() {
        await this.destroy();
    }

    public destroy() {
        assert(this.server.listening, "Server was destroyed");
        return new Promise<void>((resolve) => this.server.close(() => resolve));
    }
}
