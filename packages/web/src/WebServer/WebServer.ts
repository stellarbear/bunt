import {Application, IResponder, IRoute, MatchRoute} from "@bunt/app";
import {
    ApplyContext,
    Context,
    ContextArg,
    DisposableSync,
    Heartbeat,
    IContext,
    IDestroyable,
    IDisposableSync,
    IRunnable,
    unit,
    Unit,
} from "@bunt/unit";
import {assert, isInstanceOf, logger, Logger} from "@bunt/util";
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import {Socket} from "net";
import {IProtocolAcceptor, IResponderOptions, Responder} from "../Transport";

export class WebServer<C extends IContext> extends Application<C>
    implements IDisposableSync, IRunnable, IDestroyable {
    @logger
    public readonly logger!: Logger;
    public readonly [DisposableSync]: true;

    readonly #options: IResponderOptions;
    readonly #server: http.Server;
    readonly #acceptors = new Map<string, IProtocolAcceptor>();

    protected constructor(unit: Unit<C>, routes: MatchRoute<C, IRoute>[] = [], options?: IResponderOptions) {
        super(unit, routes);
        this.#server = new http.Server();
        this.#options = options ?? {};
    }

    public static async factory<C extends Context>(
        context: ContextArg<C>,
        routes: MatchRoute<C, IRoute>[] = [],
        options?: IResponderOptions): Promise<WebServer<ApplyContext<C>>> {
        return new this(await unit<C>(context), routes, options);
    }

    public getHeartbeat(): Heartbeat {
        return new Heartbeat((resolve) => this.#server.once("close", resolve));
    }

    public listen(port: number, backlog?: number): this {
        assert(!this.#server.listening, "Server already in listening mode");

        this.#server.on("upgrade", this.handleUpgrade);
        this.#server.on("request", this.handleRequest)
            .on("listening", () => this.logger.info("listen", {port}))
            .listen({port, backlog});

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

    public setUpgradeProtocolAcceptor(acceptor: IProtocolAcceptor): () => void {
        const protocol = acceptor.protocol.toLowerCase();
        assert(
            !this.#acceptors.has(protocol),
            `The ${acceptor.protocol} acceptor has already exists`,
        );

        this.logger.info("Set upgrade protocol acceptor", {protocol});
        this.#acceptors.set(protocol, acceptor);
        return () => this.#acceptors.delete(protocol);
    }

    protected async handle<R extends IResponder>(request: R): Promise<void> {
        const finish = this.logger.perf("handle", request);

        try {
            assert(request.validate(this), "Invalid Request");
            await request.respond(await this.run(request));
        } catch (error) {
            if (!request.complete) {
                await request.respond(error);
            }

            if (isInstanceOf(error, Error)) {
                throw error;
            }
        } finally {
            finish();
        }
    }

    protected handleUpgrade = (req: IncomingMessage, socket: Socket, head: Buffer) => {
        const {upgrade} = req.headers;
        try {
            assert(upgrade, "Upgrade headers mustn't be empty");

            const protocol = upgrade.toLowerCase();
            const acceptor = this.#acceptors.get(protocol);
            assert(acceptor, `Unsupported protocol ${protocol}`);
            acceptor.handle(req, socket, head);
        } catch (error) {
            this.logger.warning(error.message, error);
            socket.write(`HTTP/1.1 400 Bad request\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\n`);
            socket.destroy(error);
        }
    };

    protected handleRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const finish = this.logger.perf("request", {request: req.method, url: req.url});
        try {
            this.logger.info(`${req.method} ${req.url}`);
            await this.handle(new Responder(req, res, this.#options));
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
            finish();
            res.writable && res.end();
        }
    };
}
