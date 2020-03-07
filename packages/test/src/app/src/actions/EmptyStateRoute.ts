import {PathRoute} from "@typesafeunit/app";
import {EmptyStateAction} from "./EmptyStateAction";

export default new PathRoute(
    EmptyStateAction,
    {
        route: "/noop",
    },
);
