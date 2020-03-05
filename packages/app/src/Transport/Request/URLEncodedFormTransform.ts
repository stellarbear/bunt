import {parse} from "querystring";
import {IRequest} from "../../interfaces";

export const URLEncodedFormTransform = async <T extends object = object>(request: IRequest): Promise<T> => {
    request.headers.assert("Content-Type", "application/x-www-form-urlencoded");
    const buffer = await request.getBuffer();
    return parse(buffer.toString("utf-8")) as T;
};
