import { Uuid } from "@lambda-group/scylladb";
import { DataSource } from "../data-source";
import { BaseEntity } from "../entity/base";
export declare class Repository<T> {
    private dataSource;
    private tableName;
    private columns;
    private entityClass;
    constructor(dataSource: DataSource, entityClass: new () => T extends BaseEntity ? T : never);
    findOne<U extends string | number | Uuid>(id: U): Promise<T | null>;
    save(entity: T): Promise<void>;
}
