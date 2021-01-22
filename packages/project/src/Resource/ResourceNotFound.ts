export class ResourceNotFound extends Error {
    constructor(file: string) {
        super(`Resource ${file} not found`);
    }
}
