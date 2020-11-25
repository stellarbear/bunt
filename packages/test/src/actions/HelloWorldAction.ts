import {Action, IContext} from "../../../unit";

interface IHelloWorldActionState {
    id: number;
    payload: {
        name: string;
    };
    option?: boolean;
}

export class HelloWorldAction extends Action<IContext, IHelloWorldActionState> {
    public run(): string {
        const {payload} = this.state;
        return `Hello, ${payload.name}!`;
    }
}
