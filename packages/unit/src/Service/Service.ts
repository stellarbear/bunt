import {IServiceResolver} from "../interfaces";
import {ServiceRef} from "./ServiceRef";

export abstract class Service<T> implements IServiceResolver<T> {
    public static getRef(target: object) {
        return ServiceRef.get(target);
    }

    public static resolve(): PropertyDecorator {
        return (target, key) => {
            ServiceRef.set(target, key);
        };
    }

    public abstract resolve(): Promise<T>;
}
