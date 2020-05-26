export interface ISafeReadableError {
    toSafeString(): string;

    toSafeJSON(): Record<any, any>;
}
