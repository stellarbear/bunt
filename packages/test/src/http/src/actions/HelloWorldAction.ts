import {Payload} from "@typesafeunit/app";
import {Action, ActionHooks, IContext, ValidationSchema} from "@typesafeunit/unit";
import {assert, isNumber, isString} from "@typesafeunit/util";

interface IHelloWorldActionState {
    id: number;
    payload: {
        name: string;
    };
}

export class HelloWorldAction extends Action<IContext, IHelloWorldActionState> {
    public static get hooks(): ActionHooks<HelloWorldAction> {
        return {
            validate: (validationSchema) => validationSchema
                .add("id", (v) => assert(isNumber(v)))
                .add("payload", new ValidationSchema<Payload<IHelloWorldActionState>>()
                    .add("name", (v) => assert(isString(v))),
                ),
        };
    }

    public run() {
        const {payload} = this.state;
        return `Hello, ${payload.name}!`;
    }
}

