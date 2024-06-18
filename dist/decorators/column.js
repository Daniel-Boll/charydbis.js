"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = exports.ColumnType = void 0;
var ColumnType;
(function (ColumnType) {
    ColumnType["TEXT"] = "TEXT";
    ColumnType["VARCHAR"] = "VARCHAR";
    ColumnType["UUID"] = "UUID";
})(ColumnType || (exports.ColumnType = ColumnType = {}));
function Column(options) {
    return function (target, key) {
        if (!target.constructor.columns) {
            target.constructor.columns = [];
        }
        let columnName = key;
        let columnType = ColumnType.TEXT;
        if (typeof options === 'string') {
            columnName = options;
        }
        else if (typeof options === 'object') {
            columnName = options.name || key;
            columnType = options.type || ColumnType.TEXT;
        }
        target.constructor.columns.push({ key, columnName, columnType });
    };
}
exports.Column = Column;
