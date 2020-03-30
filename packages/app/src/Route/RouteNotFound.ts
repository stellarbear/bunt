export class RouteNotFound extends Error {
    constructor(route: string) {
        super(`Route Not Found "${route}"`);
    }
}
