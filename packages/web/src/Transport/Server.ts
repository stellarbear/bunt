import {Application} from "@typesafeunit/app";
import {DisposableSync, IDestroyable, IDisposableSync, IRunnable} from "@typesafeunit/unit";
import {Heartbeat} from "@typesafeunit/unit/dist/Runtime/Heartbeat";
import {assert, logger, Logger} from "@typesafeunit/util";
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {IServerOptions} from "./interfaces";
import {Request} from "./Request";

export class Server implements IDisposableSync, IRunnable, IDestroyable {
    @logger
    public readonly logger!: Logger;
    public readonly [DisposableSync]: true;

    protected readonly server: http.Server;

    protected readonly options: IServerOptions;

    protected readonly application: Application<any, any>;

    constructor(application: Application<any, any>, options?: IServerOptions) {
        this.application = application;
        this.server = new http.Server();
        this.options = options ?? {};
    }

    public getHeartbeat() {
        return new Heartbeat((resolve) => this.server.once("close", resolve));
    }

    public listen(port: number) {
        assert(!this.server.listening, "Server already in listening mode");

        this.server.on(
            "request",
            async (req: IncomingMessage, res: ServerResponse) => {
                const finish = this.logger.perf("request", {request: req.method, url: req.url});
                try {
                    this.logger.info(`${req.method} ${req.url}`);
                    await this.application.handle(new Request(req, res));
                } catch (error) {
                    this.logger.alert(
                        error.message,
                        error,
                        {url: req.url, method: req.method, headers: req.rawHeaders},
                    );

                    if (!res.headersSent) {
                        res.writeHead(500, "Internal Server Error");
                    }
                } finally {
                    res.writable && res.end();
                    finish();
                }
            })
            .on("listening", () => this.logger.info("listen", {port}))
            .listen(port);

        return this;
    }

    public async dispose() {
        await this.destroy();
    }

    public destroy() {
        this.logger.info("destroy");
        assert(this.server.listening, "Server was destroyed");
        return new Promise<void>((resolve) => this.server.close(() => resolve));
    }
}
