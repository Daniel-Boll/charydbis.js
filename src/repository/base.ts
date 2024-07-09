import type { Uuid } from "@lambda-group/scylladb";
import type { DataSource } from "../data-source";
import type {
  AnyArray,
  FilterQuery,
  ColumnDefinition,
  NonFilteredQuery,
} from "../decorators";
import { ColumnType, PrimaryKeyProp } from "../decorators";
import type { BaseModelConstructor } from "../model";
import { Logger } from "../utils/logger";

export class Repository<T extends { [PrimaryKeyProp]?: AnyArray }> {
  private dataSource: DataSource;
  private tableName: string;
  private columns: ColumnDefinition[];
  private modelClass: BaseModelConstructor;
  private logger: Logger = new Logger(Repository.name);

  constructor(dataSource: DataSource, modelClass: BaseModelConstructor) {
    this.dataSource = dataSource;
    this.tableName = modelClass.prototype.tableName;
    this.columns = modelClass.columns ?? [];
    this.modelClass = modelClass;
  }

  private columnToValue(
    column: ColumnDefinition,
    row: Record<string, string | number>,
  ): string | number | Date | Uuid {
    switch (column.columnType) {
      case ColumnType.TEXT:
      case ColumnType.ASCII:
        return row[column.columnName];
      case ColumnType.FLOAT:
        return row[column.columnName];
      case ColumnType.TIMESTAMP:
      case ColumnType.DATE:
        return new Date(row[column.columnName]);
      case ColumnType.UUID: {
        if (typeof row[column.columnName] !== "string")
          throw new Error("UUID must be a string");

        return row[column.columnName] as string;
        // return Uuid.fromString(row[column.columnName] as string);
      }
      default:
        return row[column.columnName];
    }
  }

  async findAll(): Promise<T[] | null> {
    const session = this.dataSource.getSession();
    const columnNames = this.columns.map((col) => col.columnName).join(", ");

    const query = `SELECT ${columnNames} FROM ${this.tableName}`;
    this.logger.log(`Executing query: ${query}`);

    return (await session.execute(query, [])).map((row: unknown) => {
      const model = new this.modelClass();
      for (const col of this.columns) {
        // @ts-ignore: Object has no index signature
        model[col.key] = this.columnToValue(col, row);
      }

      return model;
    });
  }

  async findBy(query: FilterQuery<T>): Promise<T[]> {
    const session = this.dataSource.getSession();
    const columnNames = this.columns.map((col) => col.columnName).join(", ");

    const whereClause = Object.keys(query)
      .filter((key) => key !== "allowFiltering")
      .map((key) => {
        const column = this.columns.find((col) => col.key === key);
        if (!column) {
          this.logger.error(`Column ${key} not found`);
          throw new Error(`Column ${key} not found`);
        }

        return `${column.columnName} = ?`;
      })
      .join(" AND ");

    // Omit allowFiltering from the query
    const values = Object.keys(query)
      .filter((key) => key !== "allowFiltering")
      .map((key) => query[key as keyof FilterQuery<T>] as NonFilteredQuery<T>);
    const allowFiltering = query.allowFiltering ? " ALLOW FILTERING" : "";

    const queryStr = `SELECT ${columnNames} FROM ${this.tableName} WHERE ${whereClause} ${allowFiltering}`;
    this.logger.log(`Executing query: ${queryStr} with values: [${values}]`);

    return (await session.execute(queryStr, values)).map((row: unknown) => {
      const model = new this.modelClass();
      for (const col of this.columns) {
        // @ts-ignore: Object has no index signature
        model[col.key] = this.columnToValue(col, row);
      }

      return model;
    });
  }

  async findByPartitionKey<U extends string | number | Uuid>(
    id: U,
  ): Promise<T[]> {
    const session = this.dataSource.getSession();
    const columnNames = this.columns.map((col) => col.columnName).join(", ");
    const partitionKey = this.columns.find((col) => col.partitionKey);
    if (!partitionKey) {
      this.logger.error("Primary key not found");
      throw new Error("Primary key not found");
    }

    const query = `SELECT ${columnNames} FROM ${this.tableName} WHERE ${partitionKey.columnName} = ?`;
    this.logger.log(`Executing query: ${query} with values: [${id}]`);

    return (await session.execute(query, [id])).map((row: unknown) => {
      const model = new this.modelClass();
      for (const col of this.columns) {
        // @ts-ignore: Object has no index signature
        model[col.key] = this.columnToValue(col, row);
      }

      return model;
    });
  }

  async save(model: T): Promise<void> {
    const session = this.dataSource.getSession();

    const columnNames = this.columns.map((col) => col.columnName).join(", ");
    // @ts-ignore: Object has no index signature
    const values = this.columns.map((col) => model[col.key]);
    const placeholders = this.columns.map(() => "?").join(", ");

    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders})`;
    this.logger.log(`Executing query: ${query} with values: ${values}`);
    await session.execute(query, values);
  }
}
