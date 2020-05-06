import {DateTime, DateTimeKind} from "@typesafeunit/util";

describe("DateTime", () => {
    const date = new DateTime("2020-02-12T12:35:13.123Z");
    test("mutate()", () => {
        const mutations: [DateTimeKind, number][] = [
            ["ms", +100],
            ["sec", +10],
            ["min", -10],
            ["hour", +2],
            ["day", -1],
            ["year", -5],
        ];

        const result = [];
        for (const value of mutations) {
            result.push(date.mutate(value).getDate());
        }

        expect(result).toMatchSnapshot();
    });

    test("set()", () => {
        const setters: [DateTimeKind, number][] = [
            ["ms", 333],
            ["sec", 22],
            ["min", 11],
            ["hour", 0],
            ["day", 11],
            ["year", 2022],
        ];

        const result = [];
        for (const value of setters) {
            result.push(date.set(value).getDate());
        }

        expect(result).toMatchSnapshot();
    });

    test("begins/ends()", () => {
        const result = [];
        const begins: Exclude<DateTimeKind, "ms" | "week">[] = ["sec", "min", "hour", "day", "month", "year"];
        for (const kind of begins) {
            result.push({
                begins: date.begins(kind).getDate(),
                ends: date.ends(kind).getDate(),
            });
        }

        expect(result).toMatchSnapshot();
    });
});
