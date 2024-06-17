import { BaseEntity } from "../entity/base";

export function Entity(tableName: string) {
  return function (constructor: Function) {
    constructor.prototype.tableName = tableName;
    constructor.prototype.__proto__ = BaseEntity.prototype
  };
}
