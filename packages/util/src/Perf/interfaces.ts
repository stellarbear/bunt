export interface IPerfValue {
    label: string;
    start: number;
    finish: number;
    time: number;
}

export type PerfLabel = (string | Record<any, any>);
