"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
class Repository {
    dataSource;
    tableName;
    columns;
    entityClass;
    constructor(dataSource, entityClass) {
        this.dataSource = dataSource;
        this.tableName = entityClass.prototype.tableName;
        this.columns = entityClass.columns;
        this.entityClass = entityClass;
    }
    async findOne(id) {
        const session = this.dataSource.getSession();
        const columnNames = this.columns.map(col => col.columnName).join(', ');
        const query = `SELECT ${columnNames} FROM ${this.tableName} WHERE id = ?`;
        const result = await session.execute(query, [id]);
        if (result.length === 0) {
            return null;
        }
        const entity = new this.entityClass();
        this.columns.forEach((col) => {
            entity[col.key] = result[0][col.columnName];
        });
        return entity;
    }
    async save(entity) {
        const session = this.dataSource.getSession();
        const columnNames = this.columns.map(col => col.columnName).join(', ');
        const values = this.columns.map(col => entity[col.key]);
        const placeholders = this.columns.map(() => '?').join(', ');
        const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders})`;
        await session.execute(query, values);
    }
}
exports.Repository = Repository;
