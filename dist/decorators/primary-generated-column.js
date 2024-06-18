"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryGeneratedColumn = void 0;
const column_1 = require("./column");
function PrimaryGeneratedColumn(option) {
    return function (target, key) {
        if (!target.constructor.columns) {
            target.constructor.columns = [];
        }
        target.constructor.columns.push({ key, columnName: option.name || key, columnType: column_1.ColumnType.UUID, primaryKey: true });
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
