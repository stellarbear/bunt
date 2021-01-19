import {assert, isFunction, isObject} from "@bunt/util";
import {GQLClientConnection} from "./GQLClientConnection";
import {
    GQLClientOperation,
    GQLClientOperationType,
    GQLClientPayload,
    GQLError,
    GQLOperationMessage,
    GQLServerOperationType,
    GQLSubscribeFunction,
} from "./index";

// @TODO Upgrade type validation to input schema validation
const AllowTypes: string[] = Object.values(GQLClientOperationType);

/**
 * @final
 */
export class GQLProtoLayer {
    readonly #subscribe: GQLSubscribeFunction;
    readonly #client: GQLClientConnection;
    readonly #subscriptions = new Map<string, AsyncIterableIterator<any>>();

    constructor(client: GQLClientConnection, factory: GQLSubscribeFunction) {
        this.#client = client;
        this.#subscribe = factory;
    }

    public async handle(operation: GQLOperationMessage): Promise<void> {
        assert(this.isClientOperation(operation), `Wrong the Operation Message`);
        switch (operation.type) {
            case GQLClientOperationType.CONNECTION_INIT:
                this.#client.send({type: GQLServerOperationType.CONNECTION_ACK});
                break;
            case GQLClientOperationType.CONNECTION_TERMINATE:
                this.terminate();
                break;
            case GQLClientOperationType.START:
                setImmediate(() => this.createSubscription(operation.id, operation.payload));
                break;
            case GQLClientOperationType.STOP:
                const subscription = this.#subscriptions.get(operation.id);
                if (subscription) {
                    this.#subscriptions.delete(operation.id);
                    subscription.return?.();
                }
        }
    }

    private async createSubscription(id: string, payload: GQLClientPayload): Promise<void> {
        try {
            const subscription = await this.#subscribe(payload);
            assert(isFunction(subscription.return), "AsyncIterator should be cancelable");

            this.#subscriptions.set(id, subscription);
            for await (const next of subscription) {
                this.#client.send({id, payload: next, type: GQLServerOperationType.DATA});
            }
        } catch (error) {
            this.#client.send({id, payload: this.serializeError(error), type: GQLServerOperationType.ERROR});
        }

        this.#client.send({id, type: GQLServerOperationType.COMPLETE});
    }

    private isClientOperation(operation: GQLOperationMessage): operation is GQLClientOperation {
        return isObject(operation) && AllowTypes.includes(operation.type);
    }

    private isReadableError(error: unknown): error is GQLError {
        return isObject(error) && "message" in error;
    }

    private serializeError(error: unknown): GQLError {
        if (error instanceof Error) {
            return {message: error.message, code: 500};
        }

        if (this.isReadableError(error)) {
            return error;
        }

        return {message: "Unknown error", code: 500};
    }

    private terminate() {
        for (const [id, subscription] of this.#subscriptions.entries()) {
            this.#subscriptions.delete(id);
            subscription.return?.();
        }
    }
}
