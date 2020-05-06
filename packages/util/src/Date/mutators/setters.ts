import {DateTimeKind, TimeMutateFn} from "../interface";

const hour: TimeMutateFn = (time, value) => new Date(time).setHours(value);
const day: TimeMutateFn = (time, value) => new Date(time).setDate(value);
const week: TimeMutateFn = (time, value) => new Date(time).setDate(value);
const month: TimeMutateFn = (time, value) => new Date(time).setDate(value);
const year: TimeMutateFn = (time, value) => new Date(time).setFullYear(value);

export default new Map<DateTimeKind, TimeMutateFn>([
    ["ms", (time, value) => new Date(time).setMilliseconds(value)],
    ["sec", (time, value) => new Date(time).setSeconds(value)],
    ["min", (time, value) => new Date(time).setMinutes(value)],
    ["hour", hour],
    ["day", day],
    ["week", week],
    ["month", month],
    ["year", year],
]);
