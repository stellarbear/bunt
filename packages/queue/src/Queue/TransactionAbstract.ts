import {isFunction} from "@typesafeunit/util";
import {createHandleState} from "./fn";
import {HandleResult, IHandleFail, IHandleResultFactory, ITransaction, Message} from "./interfaces";

export abstract class TransactionAbstract<M extends Message> implements ITransaction<M> {
    readonly #message: M;
    readonly #commit?: (message: M) => void;
    readonly #rollback?: (message: M) => void;
    readonly #handle: IHandleResultFactory<M>;

    constructor(message: M, commit?: (message: M) => void, rollback?: (message: M) => void) {
        this.#message = message;
        this.#commit = commit;
        this.#rollback = rollback;
        this.#handle = createHandleState(message);
    }

    public get message(): M {
        return this.#message;
    }

    public async commit(): Promise<HandleResult<M>> {
        try {
            if (isFunction(this.#commit)) {
                await this.#commit(this.message);
            }

            return this.#handle();
        } catch (error) {
            return this.#handle(error);
        }
    }

    public async rollback(reason?: Error): Promise<IHandleFail<M>> {
        if (isFunction(this.#rollback)) {
            this.#rollback(this.message);
        }

        return this.#handle(reason ?? new Error("Unknown reason"));
    }
}
