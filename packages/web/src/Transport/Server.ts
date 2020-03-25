import {Application} from "@typesafeunit/app";
import {IDisposable} from "@typesafeunit/unit";
import * as http from "http";
import {Connection} from "./Connection";

export class Server implements IDisposable {
    protected readonly server: http.Server;
    protected readonly application: Application<any, any>;

    constructor(application: Application<any, any>) {
        this.application = application;
        this.server = new http.Server();
    }

    public listen(port: number) {
        if (this.server.listening) {
            return this;
        }

        this.server.on(
            "request",
            async (req, res) => {
                try {
                    await this.application.handle(new Connection(req, res));
                } catch (error) {
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

    public close() {
        return new Promise((resolve) => this.server.close(() => resolve));
    }

    public async dispose() {
        if (this.server.listening) {
            await this.close();
        }
    }
}
