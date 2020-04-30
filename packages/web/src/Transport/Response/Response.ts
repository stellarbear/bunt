import {ResponseAbstract} from "./ResponseAbstract";

export class Response extends ResponseAbstract<string> {
    public stringify(): string {
        return this.data;
    }
}
