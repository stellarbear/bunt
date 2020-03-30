import {ISafeReadableError} from "./interfaces";

export const isSafeReadableError = (error: Error): error is ISafeReadableError & Error => {
    return "toSafeJSON" in error && "toSafeString" in error;
};
