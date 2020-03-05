const refs = new WeakMap<object, ServiceRef>();

export type RefPropertyType = string | symbol | number;

export class ServiceRef implements Iterable<RefPropertyType> {
    protected readonly target: object;
    protected readonly properties = new Set<RefPropertyType>();

    constructor(target: object) {
        this.target = target;
    }

    public static set(target: object, property: RefPropertyType) {
        this.get(target)
            .add(property);
    }

    public static get(target: object) {
        const ref = refs.get(target.constructor) || new ServiceRef(target);
        if (!refs.has(target.constructor)) {
            refs.set(target.constructor, ref);
        }

        return ref;
    }

    public static getProperties(target: object) {
        return [
            ...this.get(target)
                .properties.values(),
        ];
    }

    public add(key: RefPropertyType) {
        this.properties.add(key);
    }

    [Symbol.iterator]() {
        return this.properties.values();
    }
}
