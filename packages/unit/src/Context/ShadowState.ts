import {StateType} from "../interfaces";

const weakState = new WeakMap<StateType, any>();

export class ShadowState {
    public static get<SS>(state: StateType | any): SS {
        return weakState.get(state);
    }

    public static set<SS>(state: StateType, shadowState: SS): void {
        weakState.set(state, shadowState);
    }
}
