export enum ColumnType {
  TEXT = "TEXT",
  VARCHAR = "VARCHAR",
  UUID = "UUID",
}

export interface ColumnOptions {
  name?: string;
  type?: ColumnType;
}

export function Column(options?: ColumnOptions | string) {
  return function (target: any, key: string) {
    if (!target.constructor.columns) {
      target.constructor.columns = [];
    }

    let columnName = key;
    let columnType = ColumnType.TEXT;

    if (typeof options === 'string') {
      columnName = options;
    } else if (typeof options === 'object') {
      columnName = options.name || key;
      columnType = options.type || ColumnType.TEXT;
    }

    target.constructor.columns.push({ key, columnName, columnType });
  };
}
