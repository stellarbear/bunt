import {ValidationError, ValidationSchema} from "@typesafeunit/unit";
import {assert, isBoolean, isNumber, isString} from "@typesafeunit/util";

interface IChildSample {
    name: string;
    date?: string;
}

interface ISample {
    v: number;
    b: boolean;
    str: string;
    child: IChildSample;
    arrayReq: number[];
    array: string[];
    nullable: string | null;
}

const validSample: ISample = {
    v: 1,
    b: true,
    str: "foo",
    child: {
        name: "Bob",
        date: "2020-01-01T00:00:00.000Z",
    },
    arrayReq: [1, 2, 3],
    array: ["foo"],
    nullable: null,
};

const invalidSample = {
    v: null,
    b: true,
    child: {
        name: 123,
        date: "2020-01-01T00:00:00.000Z",
    },
    arrayReq: [],
    array: [],
    nullable: true,
};

test("Validation", async () => {
    const validateDate = (v: any) => assert(!!new Date(v));
    const childValidationSchema = new ValidationSchema<IChildSample>();
    childValidationSchema
        .add("date", {validator: validateDate, required: false})
        .add("name", (v) => assert(isString(v)));

    const validationSchema = new ValidationSchema<ISample>();
    validationSchema
        .add("v", (v) => assert(isNumber(v)))
        .add("b", (v) => assert(isBoolean(v)))
        .add("str", {required: false, validator: (v) => assert(isString(v))})
        .add("arrayReq", (v) => assert(isNumber(v)))
        .add("array", {validator: (v) => assert(isString(v)), required: true, nullable: true})
        .add("nullable", {validator: validateDate, nullable: true})
        .add("child", childValidationSchema);

    const success = await validationSchema.validate(validSample);
    expect(success).toMatchSnapshot();
    expect(success.valid).toBe(true);

    const fails = await validationSchema.validate(invalidSample);
    expect(fails).toMatchSnapshot();
    expect(fails.valid).toBe(false);

    const error = new ValidationError("Validation failed", fails);
    await expect(error.toSafeJSON()).toMatchSnapshot();
    await expect(error.getLogValue()).toMatchSnapshot();
});
