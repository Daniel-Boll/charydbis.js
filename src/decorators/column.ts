import "reflect-metadata";
import type { BaseEntity, BaseEntityConstructor } from "../entity";

export enum ColumnType {
	TEXT = "TEXT",
	ASCII = "ASCII",
	FLOAT = "FLOAT",
	TIMESTAMP = "TIMESTAMP",
	DATE = "DATE",
	UUID = "UUID",
}

export interface ColumnOptions {
	name?: string;
	type?: ColumnType;
	partitionKey?: true;
	clusteringKey?: true;
	clusteringKeySequence?: number;
}

export function Column(options?: ColumnOptions | string) {
	return (target: BaseEntity, key: string) => {
		const constructor_ = target.constructor as BaseEntityConstructor;

		if (!constructor_.columns) constructor_.columns = [];

		// This column type is:
		const type = Reflect.getMetadata("design:type", target, key);

		let columnName = key;
		let columnType = ColumnType.TEXT;
		let isPartitionKey = false;
		let isClusteringKey = false;
		let clusteringKeySequence = 0;

		if (typeof options === "string") columnName = options;
		else if (typeof options === "object") {
			columnName = options.name || key;
			columnType = options.type || ColumnType.TEXT;
			if (options.partitionKey) isPartitionKey = options.partitionKey;
			if (options.clusteringKey) {
				isClusteringKey = options.clusteringKey;
				clusteringKeySequence = options.clusteringKeySequence || 0;
			}
		}

		constructor_.columns.push({
			key,
			columnName,
			columnType,
			...(isPartitionKey && { partitionKey: true }),
			...(isClusteringKey && { clusteringKey: true }),
			...(isClusteringKey && { clusteringKeySequence }),
		});
	};
}

export interface ColumnDefinition {
	key: string;
	columnName: string;
	columnType: ColumnType;
	partitionKey?: true;
	clusteringKey?: true;
	clusteringKeySequence?: number;
}
