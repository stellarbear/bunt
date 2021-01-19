import {ApplyContext, Context} from "@bunt/unit";

export class BaseContext extends Context {
    public version = "1.0.0";
}

export type IBaseContext = ApplyContext<BaseContext>;
