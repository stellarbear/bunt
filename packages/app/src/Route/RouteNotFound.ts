export class RouteNotFound extends Error {
    constructor(route: string) {
        super(`Route "${route}" not found`);
    }
}
