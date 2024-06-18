import type { ClusterConfig, ScyllaSession } from "@lambda-group/scylladb";
import { BaseEntity } from "./entity/base";
import { Repository } from "./repository/base";
export declare class DataSource {
    private options;
    private cluster;
    private session;
    constructor(options: ClusterConfig);
    initialize(keyspace?: string): Promise<DataSource>;
    getSession(): ScyllaSession | never;
    getRepository<T extends BaseEntity>(entity: new () => T extends BaseEntity ? T : never): Repository<T>;
    [Symbol.dispose](): void;
}
