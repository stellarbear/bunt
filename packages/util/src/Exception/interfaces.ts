export interface ISafeReadableError {
    toSafeString(): string;
    toSafeJSON(): object;
}
