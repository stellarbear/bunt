import {isObject} from "./is";

export const freeze = <S extends { [key: string]: any }>(source: S): S => {
    const target = Object.freeze(Object.assign(Object.create(null), source));
    for (const [key, value] of Object.entries(target)) {
        // @check for plain object
        if (isObject(value)) {
            target[key] = freeze(target[key]);
        }
    }

    return target;
};

export const entriesReverse = <V>(entries: [string | number | symbol, V][]) => {
    return Object.assign(
        {},
        ...entries.map(([key, value]) => ({
            [key]: value,
        })),
    );
};

export const getClassName = (target: object, prefix?: string) => {
    prefix = prefix ? `${prefix}:` : "";
    return `${prefix}${target.constructor.name}`;
};
