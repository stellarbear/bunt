import {EqualMatcher, Route} from "@typesafeunit/app";

export const command = Route.create((cmd) => new EqualMatcher(cmd));
