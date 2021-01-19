import {ApplyContext, Context} from "@bunt/unit";

export class BaseContext extends Context {
    public now = new Date();
}

export type IBaseContext = ApplyContext<BaseContext>;
