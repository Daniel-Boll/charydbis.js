export declare enum ColumnType {
    TEXT = "TEXT",
    VARCHAR = "VARCHAR",
    UUID = "UUID"
}
export interface ColumnOptions {
    name?: string;
    type?: ColumnType;
}
export declare function Column(options?: ColumnOptions | string): (target: any, key: string) => void;
