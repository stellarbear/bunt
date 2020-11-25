import {EqualMatcher, Route} from "@typesafeunit/app";

export const command = Route.create(EqualMatcher.factory);
