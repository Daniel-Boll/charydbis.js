import type { ColumnDefinition } from "../decorators";

export interface BaseModelConstructor {
  new(): BaseModel;
  columns?: ColumnDefinition[];
}

export class BaseModel {
  constructor() {
    const columns = (this.constructor as BaseModelConstructor).columns ?? [];
    for (const col of columns) {
      // @ts-ignore: Object has no index signature
      this[col.key] = undefined;
    }
  }
}
