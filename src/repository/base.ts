import { Uuid } from "@lambda-group/scylladb";
import { DataSource } from "../data-source";
import { BaseEntity } from "../entity/base";
import { Logger } from "../logger"

export class Repository<T> {
  private dataSource: DataSource;
  private tableName: string;
  private columns: any[];
  private entityClass: new () => T extends BaseEntity ? T : never;
  private logger: Logger = new Logger(Repository.name);

  constructor(dataSource: DataSource, entityClass: new () => T extends BaseEntity ? T : never) {
    this.dataSource = dataSource;
    this.tableName = entityClass.prototype.tableName;
    this.columns = (entityClass as any).columns;
    this.entityClass = entityClass;
  }

  async findAll(): Promise<T[] | null> {
    const session = this.dataSource.getSession();

    const columnNames = this.columns.map(col => col.columnName).join(', ');
    const query = `SELECT ${columnNames} FROM ${this.tableName} ALLOW FILTERING`;
    this.logger.log(`Executing query: ${query}`);
    try {
      const result = await session.execute(query, []);
      return result.map((row: any) => {
        const entity = new this.entityClass();
        this.columns.forEach((col: any) => {
          (entity as any)[col.key] = row[col.columnName];
        });

        return entity;
      });
    } catch (error) {
      return null;
    }
  }

  async findOne<U extends string | number | Uuid>(id: U): Promise<T | null> {
    const session = this.dataSource.getSession();

    const columnNames = this.columns.map(col => col.columnName).join(', ');
    const primaryKey = this.columns.find(col => col.primaryKey);
    if (!primaryKey) {
      this.logger.error('Primary key not found');
      throw new Error('Primary key not found');
    }
    const query = `SELECT ${columnNames} FROM ${this.tableName} WHERE ${primaryKey.columnName} = ?`;
    this.logger.log(`Executing query: ${query} with values: [${id}]`);
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
    this.logger.log(`Executing query: ${query} with values: ${values}`);
    await session.execute(query, values);
  }
}

