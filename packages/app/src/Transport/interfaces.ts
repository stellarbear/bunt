export interface RouteActionState {
    payload: any;
}

export type Payload<T> = T extends RouteActionState ? T["payload"] : never;
