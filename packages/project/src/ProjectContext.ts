import {ApplyContext, Context} from "@typesafeunit/unit";
import {resolve} from "path";
import {ResourceStore} from "./Resource";

export class ProjectContext extends Context {
    public get store(): ResourceStore {
        return new ResourceStore(resolve(__dirname, "../resources"));
    }
}

export type IProjectContext = ApplyContext<ProjectContext>;
