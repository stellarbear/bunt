import {Action, ActionHooks, IContext} from "@typesafeunit/unit";
import {ValidationChild} from "@typesafeunit/unit/dist/Validation/ValidationChild";
import {assert, isNumber, isString} from "@typesafeunit/util";

interface IHelloWorldActionState {
    id: number;
    payload: {
        name: string;
    };
    option?: boolean;
}

export class HelloWorldAction extends Action<IContext, IHelloWorldActionState> {
    public static get hooks(): ActionHooks<HelloWorldAction> {
        return {
            validate: (validationSchema) => validationSchema
                .add("id", (v) => assert(isNumber(v)))
                .add("payload", new ValidationChild<IHelloWorldActionState, "payload">()
                    .add("name", (v) => assert(isString(v))),
                ),
        };
    }

    public run() {
        const {payload} = this.state;
        return `Hello, ${payload.name}!`;
    }
}

