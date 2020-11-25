import * as RedisClient from "ioredis";
import {Redis} from "ioredis";
import {parse} from "url";

export function createConnection(dsn?: string): Redis {
    if (dsn) {
        const {hostname, port, query} = parse(dsn, true);
        return new RedisClient({
            host: hostname ?? "localhost",
            port: +(port ?? 6379),
            db: +(query.db ?? 0),
        });
    }

    return new RedisClient();
}
