import {ValidationSchema} from "./ValidationSchema";

export class ValidationChild<T extends object, K extends keyof T> extends ValidationSchema<T[K]> {
}
