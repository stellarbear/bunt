import {TransformObject} from "@typesafeunit/util";

type TestEntry = {
    str: string;
    date: Date;
    obj: {
        date: Date;
        num: number;
    };
};

test("Transform", async () => {
    const transform = TransformObject.create<TestEntry>({
        date: (v: string) => new Date(v),
        obj: {
            date: (v: string) => new Date(v),
            num: (v: string) => +v,
        },
    });

    const data: any = {
        str: "foo",
        date: new Date().toISOString(),
        obj: {
            date: new Date().toISOString(),
            num: "123",
        },
    };

    expect(transform(data)).toMatchSnapshot();
});
