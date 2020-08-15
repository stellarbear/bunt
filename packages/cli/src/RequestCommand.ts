import {RequestAbstract} from "@typesafeunit/app";
import {assert, Console} from "@typesafeunit/util";
import {ReadStream} from "fs";
import {Headers} from "./Transport/Headers";

export class RequestCommand extends RequestAbstract {
    public readonly headers = new Headers([]);
    public readonly route: string;

    constructor(defaultCommand?: string) {
        super();
        const console = new Console();
        const [command = defaultCommand] = console.argv.getArgs();
        assert(command, `Command should be defined`);
        this.route = command;
    }

    public createReadableStream(): ReadStream {
        return new ReadStream();
    }

    public validate(): boolean {
        return true;
    }

    protected async write(response: string): Promise<void> {
        process.stdout.write(response + "\n");
    }
}
