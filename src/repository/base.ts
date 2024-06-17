import { Uuid } from "@lambda-group/scylladb";
import { DataSource } from "../..";
import { BaseEntity } from "../entity/base";

export class Repository<T> {
  private dataSource: DataSource;
  private tableName: string;
  private columns: any[];
  private entityClass: new () => T extends BaseEntity ? T : never;

  constructor(dataSource: DataSource, entityClass: new () => T extends BaseEntity ? T : never) {
    this.dataSource = dataSource;
    this.tableName = entityClass.prototype.tableName;
    this.columns = (entityClass as any).columns;
    this.entityClass = entityClass;
  }

  async findOne<U extends string | number | Uuid>(id: U): Promise<T | null> {
    const session = this.dataSource.getSession();

    const columnNames = this.columns.map(col => col.columnName).join(', ');
    const query = `SELECT ${columnNames} FROM ${this.tableName} WHERE id = ?`;
    const result = await session.execute(query, [id]);

    if (result.length === 0) {
      return null;
    }

    const entity = new this.entityClass();
    this.columns.forEach((col: any) => {
      (entity as any)[col.key] = result[0][col.columnName];
    });

    return entity;
  }

  async save(entity: T): Promise<void> {
    const session = this.dataSource.getSession();

    const columnNames = this.columns.map(col => col.columnName).join(', ');
    const values = this.columns.map(col => (entity as any)[col.key]);
    const placeholders = this.columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders})`;
    await session.execute(query, values);
  }
}

