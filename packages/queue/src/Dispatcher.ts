import {
    ActionCtor,
    ContextArg,
    Disposable,
    Heartbeat,
    IContext,
    IDisposable,
    IRunnable,
    Unit,
} from "@typesafeunit/unit";
import {logger, Logger} from "@typesafeunit/util";
import {ActionHandler} from "./interfaces";
import {ITransport, Message, MessageCtor, Queue, QueueAbstract} from "./Queue";

export class Dispatcher<C extends IContext> implements IDisposable, IRunnable {
    @logger
    public logger!: Logger;

    readonly #unit: Unit<C>;
    readonly #queue: QueueAbstract<ITransport>;
    readonly #route = new Map<MessageCtor<any>, ActionCtor<any>>();
    readonly #disposable: Disposable[] = [];

    protected constructor(queue: QueueAbstract<ITransport>, unit: Unit<C>) {
        this.#queue = queue;
        this.#unit = unit;
    }

    public get size(): number {
        return this.#route.size;
    }

    public static async factory<C extends IContext>(queue: Queue<ITransport>,
                                                    context: ContextArg<C>): Promise<Dispatcher<C>> {
        return new Dispatcher<C>(queue, await Unit.factory(context));
    }

    public getHeartbeat(): Heartbeat<void> {
        return Heartbeat.of<void>(this, (resolve) => this.#disposable.push(resolve));
    }

    public subscribe<M extends Message>(type: MessageCtor<M>, action: ActionCtor<ActionHandler<C, M>>): this {
        this.#unit.add<any>(action);
        this.#queue.subscribe<any>(type, (message) => {
            return this.#unit.run<any>(action, message);
        });

        return this;
    }

    public dispose(): Disposable[] {
        return [this.#queue, ...this.#disposable];
    }
}
