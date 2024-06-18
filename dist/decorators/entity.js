"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const base_1 = require("../entity/base");
function Entity(tableName) {
    return function (constructor) {
        constructor.prototype.tableName = tableName;
        constructor.prototype.__proto__ = base_1.BaseEntity.prototype;
    };
}
exports.Entity = Entity;
