import {ClientConnectionAbstract} from "./ClientConnectionAbstract";

export class ClientConnection extends ClientConnectionAbstract<string> {
    protected parse(payload: string): string {
        return payload;
    }

    protected serialize(payload: string): string {
        return payload;
    }

}
