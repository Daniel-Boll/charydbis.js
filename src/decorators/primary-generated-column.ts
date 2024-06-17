import { ColumnOptions, ColumnType } from "./column";

export function PrimaryGeneratedColumn(option: ColumnOptions) {
  return function (target: any, key: string) {
    if (!target.constructor.columns) {
      target.constructor.columns = [];
    }

    target.constructor.columns.push({ key, columnName: option.name || key, columnType: ColumnType.UUID, primaryKey: true });
  };
}
