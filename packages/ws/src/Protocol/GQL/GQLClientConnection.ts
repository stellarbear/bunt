import {ClientConnection} from "../../Connection";
import {GQLOperationMessage} from "./index";

export class GQLClientConnection extends ClientConnection<GQLOperationMessage> {
    protected parse(payload: string): GQLOperationMessage {
        return JSON.parse(payload);
    }

    protected serialize(payload: GQLOperationMessage): string {
        return JSON.stringify(payload);
    }
}
