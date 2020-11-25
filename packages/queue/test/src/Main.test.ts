import {BarMessage} from "./Queue/BarMessage";
import {FooMessage} from "./Queue/FooMessage";
import {TestQueue} from "./Queue/TestQueue";
import {TestTransport} from "./Queue/TestTransport";

describe("Response", () => {
    test("Main", async () => {
        const test = new TestQueue(new TestTransport());
        const queue: any[] = [];
        const rejected: any[] = [];
        const push = (message: any) => queue.push(message);
        const reject = () => {
            throw Error("Rejected");
        };

        await test.emit(new FooMessage(true));
        await test.emit(new BarMessage(1));

        const s1 = test.subscribe(FooMessage, push);
        await s1.unsubscribe();

        const s2 = test.subscribe(BarMessage, reject);
        s2.listenResult(({status, message, error}) => {
            rejected.push({status, message, error});
        });

        await s2.unsubscribe();
        await test.emit(new BarMessage(2));

        const s3 = test.subscribe(BarMessage, push);
        await s3.unsubscribe();

        expect(queue).toMatchSnapshot();
        expect(rejected).toMatchSnapshot();
    });
});
