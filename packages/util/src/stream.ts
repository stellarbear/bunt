import {Duplex, Readable, Stream, Transform, Writable} from "stream";

type IsStream = Readable | Writable | Duplex | Transform | Stream;

const isStream = (stream: any): stream is IsStream => (
    stream !== null &&
    typeof stream === "object" &&
    typeof stream.pipe === "function"
);

const isWritableStream = (stream: any): stream is Writable => (
    isStream(stream) &&
    "writable" in stream &&
    stream.writable !== false &&
    typeof stream._write === "function"
);

const isReadableStream = (stream: any): stream is Readable => (
    isStream(stream) &&
    "readable" in stream &&
    stream.readable !== false &&
    typeof stream._read === "function"
);

const isDuplexStream = (stream: any): stream is Duplex => (
    isWritableStream(stream) &&
    isReadableStream(stream)
);

const isTransformStream = (stream: any): stream is Transform => (
    isStream(stream) &&
    "readable" in stream &&
    stream.readable !== false &&
    "writable" in stream &&
    stream.writable !== false &&
    "_transform" in stream &&
    typeof stream._transform === "function"
);

export {
    isStream,
    isReadableStream,
    isWritableStream,
    isDuplexStream,
    isTransformStream,
};
