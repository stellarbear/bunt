import {ValidationSchema} from "@typesafeunit/unit";
import {assert, isBoolean, isNumber, isString} from "@typesafeunit/util";

interface IChildSample {
    name: string;
    date?: Date;
}

interface ISample {
    v: number;
    b: boolean;
    child: IChildSample;
    nullable: Date | null;
}

const validSample: ISample = {
    v: 1,
    b: true,
    child: {
        name: "Bob",
        date: new Date("2000-01-01 00:00:00"),
    },
    nullable: null,
};

const invalidSample = {
    v: null,
    b: true,
    child: {
        name: 123,
        date: new Date("2000-01-01 00:00:00"),
    },
    nullable: true,
};

test("Validation", async () => {
    const validateDate = (v: any) => assert(v instanceof Date);
    const childValidationSchema = new ValidationSchema<IChildSample>();
    childValidationSchema
        .add("date", {validator: validateDate, required: false})
        .add("name", (v) => assert(isString(v)));

    const validationSchema = new ValidationSchema<ISample>();
    validationSchema
        .add("v", (v) => assert(isNumber(v)))
        .add("b", (v) => assert(isBoolean(v)))
        .add("nullable", {validator: validateDate, nullable: true})
        .add("child", childValidationSchema);

    const success = await validationSchema.validate(validSample);
    expect(success).toMatchSnapshot();
    expect(success.valid).toBe(true);

    const fails = await validationSchema.validate(invalidSample);
    expect(fails).toMatchSnapshot();
    expect(fails.valid).toBe(false);
});
