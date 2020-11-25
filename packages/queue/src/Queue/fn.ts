import {assert} from "@typesafeunit/util";
import * as crypto from "crypto";
import {IHandleResultFactory, Message} from "./interfaces";

const serializeRe = /^[0-9a-f]{8}:.+$/;

export function serialize<M extends Message>(message: M): string {
    const body = JSON.stringify(message.payload);
    const signature = crypto.createHash("sha1")
        .update(body)
        .digest("hex")
        .substr(0, 8);

    return `${signature}:${body}`;
}

export function unserialize<T = unknown>(message: string): T {
    assert(serializeRe.test(message), "Wrong message format");

    const body = message.substr(9);
    const signature = message.substr(0, 8);
    const compareSignature = crypto.createHash("sha1")
        .update(body)
        .digest("hex")
        .substr(0, 8);

    assert(signature === compareSignature, "Wrong checksum");
    return JSON.parse(body);
}

export function createHandleState<M extends Message>(message: M): IHandleResultFactory<M> {
    const runAt = new Date();
    return ((error?: Error) => {
        if (error) {
            return {runAt, error, message, status: false, finishAt: new Date()};
        }

        return {
            runAt,
            message,
            finishAt: new Date(),
            status: true,
        };
    }) as IHandleResultFactory<M>;
}
