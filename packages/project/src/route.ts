import {EqualMatcher, Route} from "@bunt/app";

export const command = Route.create((cmd) => new EqualMatcher(cmd));
