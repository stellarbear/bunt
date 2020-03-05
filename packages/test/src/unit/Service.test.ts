import {ServiceFactory} from "@typesafeunit/unit";
import {MemoryDb} from "./src/context/services/MemoryDb";
import {MemoryDbServiceResolver} from "./src/context/services/MemoryDbServiceResolver";

const table: [string, (v: string) => any][] = [
    ["p1", (p) => new MemoryDbServiceResolver(p)],
    ["p2", (p) => new ServiceFactory(() => MemoryDb.connect(p))],
    ["p3", (p) => ServiceFactory.create(() => MemoryDb.connect(p))],
    ["p4", (p) => ServiceFactory.create(MemoryDb.connect(p))],
];

test("Service", async () => {
    for (const [p, f] of table) {
        const service = await f(p).resolve();
        expect(service).toBeInstanceOf(MemoryDb);
        expect(service.prefix).toBe(p);
    }
});
