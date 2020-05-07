import {IServiceResolver} from "../interfaces";
import {ServiceRef} from "./ServiceRef";

export abstract class Service<T> implements IServiceResolver<T> {
    public static getReferences(target: object, base: Function | null = null) {
        const references = [];
        for (const proto of this.getPrototypes(target, base)) {
            references.push(...ServiceRef.get(proto));
        }

        return references;
    }

    public static resolve(): PropertyDecorator {
        return (target, key) => {
            ServiceRef.set(target, key);
        };
    }

    protected static* getPrototypes(target: object, base: Function | null = null) {
        let proto = Object.getPrototypeOf(target);
        const baseProto = base === null ? null : base.prototype;
        while (baseProto !== proto) {
            yield proto;
            proto = Object.getPrototypeOf(proto);
        }
    }

    public abstract resolve(): Promise<T>;
}
