"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
class BaseEntity {
    constructor() {
        const columns = this.constructor.columns;
        if (columns) {
            columns.forEach((col) => {
                this[col.key] = null;
            });
        }
    }
}
exports.BaseEntity = BaseEntity;
