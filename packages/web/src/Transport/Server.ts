import {Application} from "@typesafeunit/app";
import * as http from "http";
import {Connection} from "./Connection";

export class Server {
    protected readonly application: Application<any, any>;

    constructor(application: Application<any, any>) {
        this.application = application;
    }

    public listen(port: number) {
        const server = new http.Server(async (req, res) => {
            try {
                const transport = new Connection(req, res);
                await this.application.handle(transport);
            } catch (error) {
                if (!res.headersSent) {
                    res.writeHead(500, "Internal Server Error");
                }
            } finally {
                res.writable && res.end();
            }
        });

        server.listen(port);

        this.destroyServerCallback = () => new Promise((res, rej) => (
            server.close((error) => error && rej(error) || res())
        ));

        return this.destroyServerCallback;
    }

    public close() {
        return this.destroyServerCallback();
    }

    private destroyServerCallback = () => Promise.resolve();
}
