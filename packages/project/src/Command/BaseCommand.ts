import {Action} from "@typesafeunit/unit";
import {logger, Logger} from "@typesafeunit/util";
import {IProjectContext} from "../ProjectContext";

export abstract class BaseCommand<S extends Record<string, any> | null = null> extends Action<IProjectContext, S> {
    @logger
    protected logger!: Logger;
}
