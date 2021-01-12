import {Application} from "@bunt/app";
import {DisposableSync, Heartbeat, IDestroyable, IDisposableSync, IRunnable} from "@bunt/unit";
import {assert, logger, Logger} from "@bunt/util";
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {IServerOptions} from "./interfaces";
import {Request} from "./Request";

export class Server implements IDisposableSync, IRunnable, IDestroyable {
    @logger
    public readonly logger!: Logger;
    public readonly [DisposableSync]: true;

    readonly #options: IServerOptions;
    readonly #application: Application<any, any>;
    readonly #server: http.Server;

    constructor(application: Application<any, any>, options?: IServerOptions) {
        this.#application = application;
        this.#server = new http.Server();
        this.#options = options ?? {};
    }

    public getHeartbeat(): Heartbeat {
        return new Heartbeat((resolve) => this.#server.once("close", resolve));
    }

    public listen(port: number): this {
        assert(!this.#server.listening, "Server already in listening mode");

        this.#server.on("request", this.handle)
            .on("listening", () => this.logger.info("listen", {port}))
            .listen(port);

        return this;
    }

    public async dispose(): Promise<void> {
        await this.destroy();
    }

    public destroy(): Promise<void> {
        this.logger.info("destroy");
        assert(this.#server.listening, "Server was destroyed");
        return new Promise<void>((resolve) => this.#server.close(() => resolve));
    }

    protected handle = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const finish = this.logger.perf("request", {request: req.method, url: req.url});
        try {
            this.logger.info(`${req.method} ${req.url}`);

            await this.#application.handle(new Request(req, res, this.#options));
        } catch (error) {
            this.logger.alert(
                error.message,
                error,
                {url: req.url, method: req.method, headers: req.headers},
            );

            if (!res.headersSent) {
                res.writeHead(500, "Internal Server Error");
            }
        } finally {
            res.writable && res.end();
            finish();
        }
    };
}
