import {TransformObject} from "@typesafeunit/util";

type TestEntry = {
    str: string;
    date: Date;
    obj: {
        date: Date;
        num: number;
    };
    arr: {f: number}[];
};

test("Transform", async () => {
    const transform = TransformObject.create<TestEntry>({
        date: (v: string) => new Date(v),
        obj: {
            date: (v: string) => new Date(v),
            num: (v: string) => +v,
        },
        arr: {
            f: (v: string) => +v,
        },
    });

    const data: any = {
        str: "foo",
        date: "2000-01-01T00:00:00.000Z",
        obj: {
            date: "2000-01-01T00:00:00.000Z",
            num: "123",
        },
        arr: [{f: "1"}],
    };

    expect(await transform(data)).toEqual({
        str: "foo",
        date: new Date("2000-01-01T00:00:00.000Z"),
        obj: {
            date: new Date("2000-01-01T00:00:00.000Z"),
            num: 123,
        },
        arr: [{f: 1}],
    });
});
