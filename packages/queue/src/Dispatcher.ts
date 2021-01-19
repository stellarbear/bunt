import {
    ActionContextCtor,
    ActionCtor,
    ApplyContext,
    Context,
    ContextArg,
    Disposable,
    Heartbeat,
    IContext,
    IDisposable,
    IRunnable,
    unit,
    Unit,
} from "@bunt/unit";
import {logger, Logger} from "@bunt/util";
import {ActionHandler} from "./interfaces";
import {ITransport, Message, MessageCtor, MessageHandler, Queue, QueueAbstract} from "./Queue";

export class Dispatcher<C extends IContext> implements IDisposable, IRunnable {
    @logger
    public logger!: Logger;

    readonly #unit: Unit<C>;
    readonly #queue: QueueAbstract<ITransport>;
    readonly #route = new Map<MessageCtor<any>, ActionContextCtor<C, any>>();
    readonly #disposable: Disposable[] = [];

    protected constructor(u: Unit<C>, queue: QueueAbstract<ITransport>) {
        this.#queue = queue;
        this.#unit = u;
    }

    public get size(): number {
        return this.#route.size;
    }

    public static async factory<C extends Context>(queue: Queue<ITransport>,
                                                   context: ContextArg<C>): Promise<Dispatcher<ApplyContext<C>>> {
        return new this(await unit(context), queue);
    }

    public getHeartbeat(): Heartbeat<void> {
        return Heartbeat.of<void>(this, (resolve) => this.#disposable.push(resolve));
    }

    public subscribe<M extends Message>(type: MessageCtor<M>, action: ActionCtor<ActionHandler<C, M>>): this {
        this.#unit.add(action);
        this.#queue.subscribe(type, ((message) => {
            return this.#unit.run(action, message);
        }) as MessageHandler<M>);

        return this;
    }

    public dispose(): Disposable[] {
        return [this.#queue, ...this.#disposable];
    }
}
