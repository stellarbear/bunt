import {getWeekBegins} from "../Locale";

const weekBegins = getWeekBegins();

const sec = (time: number) => new Date(time).setMilliseconds(0);
const min = (time: number) => new Date(time).setSeconds(0, 0);
const hour = (time: number) => new Date(time).setMinutes(0, 0, 0);
const day = (time: number) => new Date(time).setHours(0, 0, 0, 0);
const month = (time: number) => day(new Date(time).setDate(0));
const year = (time: number) => month(new Date(time).setMonth(0));
const week = (time: number) => {
    const dt = new Date(time);
    return day(dt.setDate(dt.getDate() - dt.getDay() + weekBegins));
};

export default {
    sec,
    min,
    hour,
    day,
    week,
    month,
    year,
};
