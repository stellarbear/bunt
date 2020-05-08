import {Request} from "./Request";

export type ServerHeadersResolver = (request: Request) => {[key: string]: string};
export interface IServerOptions {
    headers?: {[key: string]: string} | ServerHeadersResolver;
}
