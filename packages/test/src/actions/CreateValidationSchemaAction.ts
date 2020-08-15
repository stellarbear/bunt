import {Action, ValidationSchema} from "../../../unit";
import {assert, isNumber} from "../../../util";
import {IBaseContext} from "../interfaces";

interface ICreateValidationSchemaState {
    id: number;
}

export class CreateValidationSchemaAction extends Action<IBaseContext, ICreateValidationSchemaState> {
    public createValidationSchema(): ValidationSchema<ICreateValidationSchemaState> {
        return new ValidationSchema<ICreateValidationSchemaState>()
            .add("id", (v) => assert(isNumber(v)));
    }

    public run(): string {
        return this.state.id.toString(32);
    }
}
