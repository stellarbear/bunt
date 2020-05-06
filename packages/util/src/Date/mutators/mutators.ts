import {DateTimeKind, TimeMultiply, TimeMutateFn} from "../interface";

const hour: TimeMutateFn = (time, value) => time + (value * TimeMultiply.HOUR);
const day: TimeMutateFn = (time, value) => time + (value * TimeMultiply.DAY);

const week: TimeMutateFn = (time, value) => {
    const date = new Date(time);
    return date.setDate(date.getDate() + (value * 7));
};

const month: TimeMutateFn = (time, value) => {
    const date = new Date(time);
    return date.setMonth(date.getMonth() + value);
};

const year: TimeMutateFn = (time, value) => {
    const date = new Date(time);
    return date.setFullYear(date.getFullYear() + value);
};

export default new Map<DateTimeKind, TimeMutateFn>([
    ["ms", (time, value) => time + value],
    ["sec", (time, value) => time + (value * TimeMultiply.SEC)],
    ["min", (time, value) => time + (value * TimeMultiply.MIN)],
    ["hour", hour],
    ["day", day],
    ["week", week],
    ["month", month],
    ["year", year],
]);
