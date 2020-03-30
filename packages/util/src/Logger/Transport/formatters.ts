import {isDefined} from "../../is";
import {LogFormat, SeverityLevel} from "../interfaces";

export const defaultLogFormat: LogFormat = (log) => JSON.stringify(log);
export const readableJSONLogFormat: LogFormat = (log) => JSON.stringify(log, null, 2);

const arrayToString = (...str: string[]) => str.join("");
export const debugLogFormat: LogFormat = (log) => {
    const {pid, label, message, timestamp, host, severity, groupId, system, args} = log;

    const info: (string | undefined)[] = [
        new Date(timestamp).toISOString(),
        SeverityLevel[severity],
        `srv=${host}`,
        `pid=${pid.toString()}`,
        groupId ? `group=${groupId}` : void 0,
    ];

    const debug = [info.filter(isDefined).join(" "), arrayToString(label, ": ", message)];
    isDefined(system) && debug.push(JSON.stringify(system, null, 2));
    isDefined(args) && debug.push(JSON.stringify(args, null, 2));

    return debug.join("\n");
};
