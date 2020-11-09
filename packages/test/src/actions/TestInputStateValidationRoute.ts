import {Payload, RegexpMatcher} from "@typesafeunit/app";
import {Resolver} from "@typesafeunit/app/dist/Payload";
import {Route} from "@typesafeunit/app/dist/Route/Route";
import {DateTime, ObjectType, Text, Varchar} from "@typesafeunit/input";
import {Action, IContext} from "../../../unit";

interface ITestTypeValidationState {
    session: string;
    payload: {
        name: string;
        bd?: Date;
    };
}

class TestInputStateValidationAction extends Action<IContext, ITestTypeValidationState> {
    public run(): Record<string, any> {
        const {session, payload} = this.state;
        return {
            session,
            welcome: `Hello, ${payload.name} (age: ${payload.bd?.toDateString() ?? "N/A"})!`,
            bd: payload.bd,
        };
    }
}

const route = Route.create((route: string) => new RegexpMatcher(route));
export const type = new ObjectType<ITestTypeValidationState>({
    session: new Varchar({min: 8, max: 256}),
    payload: new ObjectType({name: Text, bd: DateTime}),
});

export const resolver = new Resolver<TestInputStateValidationAction>({
    session: ({request: {headers}}) => headers.get("authorization"),
    payload: ({request}) => request.toObject(),
});

export default route(
    "/test",
    TestInputStateValidationAction,
    new Payload(type, resolver),
);
