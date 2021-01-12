import {Action} from "@bunt/unit";
import {logger, Logger} from "@bunt/util";
import {IProjectContext} from "../ProjectContext";

export abstract class BaseCommand<S extends Record<string, any> | null = null> extends Action<IProjectContext, S> {
    @logger
    protected logger!: Logger;
}
