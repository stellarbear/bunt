import {ResponderAbstract} from "@bunt/app";
import {assert, Console} from "@bunt/util";
import {Headers} from "./Transport/Headers";

export class RequestCommand extends ResponderAbstract {
    public readonly headers = new Headers([]);
    public readonly route: string;

    constructor(defaultCommand?: string) {
        super();
        const console = new Console();
        const [command = defaultCommand] = console.argv.getArgs();
        assert(command, `Command should be defined`);
        this.route = command;
    }

    public createReadableStream(): NodeJS.ReadableStream {
        return process.stdin;
    }

    public validate(): boolean {
        return true;
    }

    protected async write(response: string): Promise<void> {
        process.stdout.write(response + "\n");
    }
}
