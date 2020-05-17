import {assert} from "../assert";
import {DateTimeMutation} from "./DateTimeMutation";
import {DateTimeKind} from "./interface";

export class DateTime {
    readonly #date: Date;

    constructor(date: string | number | Date = new Date()) {
        this.#date = new Date(date);
        assert(this.#date.getTime() > 0);
    }

    public get date() {
        return new Date(this.#date);
    }

    public static from(date: string | number | Date = new Date()) {
        return new this(date);
    }

    public getTime() {
        return this.#date.getTime();
    }

    public getDate() {
        return this.date;
    }

    public toString() {
        return this.date.toString();
    }

    public begins(kind: Exclude<DateTimeKind, "ms">) {
        return new DateTime(DateTimeMutation.begins(kind, this.getTime()));
    }

    public ends(kind: Exclude<DateTimeKind, "ms">) {
        return new DateTime(DateTimeMutation.ends(kind, this.getTime()));
    }

    public mutate(...mutations: [DateTimeKind, number][]) {
        return new DateTime(DateTimeMutation.mutate(this.getTime(), ...mutations));
    }

    public set(...intervals: [DateTimeKind, number][]) {
        return new DateTime(DateTimeMutation.set(this.getTime(), ...intervals));
    }
}
