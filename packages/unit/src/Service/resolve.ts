import {Service} from "./Service";

export const resolve: PropertyDecorator = (p, k) => {
    Service.resolve()(p, k);
};
