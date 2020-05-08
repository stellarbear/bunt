import {Request} from "./Request";

export type ServerHeadersResolver = (request: Request) => { [key: string]: string };

export interface IServerOptions {
    headers?: { [key: string]: string } | ServerHeadersResolver;
}

export interface IRequestSendOptions {
    code: number;
    status?: string;
    headers?: { [key: string]: string };
}
