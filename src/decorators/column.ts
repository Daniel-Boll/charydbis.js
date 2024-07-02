import "reflect-metadata";
import type { BaseEntity, BaseEntityConstructor } from "../entity";
import { snakeCaseTransform } from "../utils/snake-case-transform";

export enum ColumnType {
	TEXT = "TEXT",
	ASCII = "ASCII",
	FLOAT = "FLOAT",
	TIMESTAMP = "TIMESTAMP",
	DATE = "DATE",
	UUID = "UUID",
}

const getColumnType = (type?: string): ColumnType => {
	const lowerType = type?.toLowerCase();
	switch (lowerType) {
		case "string":
			return ColumnType.TEXT;
		case "number":
			return ColumnType.FLOAT;
		case "date":
			return ColumnType.DATE;
		case "uuid":
			return ColumnType.UUID;
		default:
			return ColumnType.TEXT;
	}
};

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

		const propType = Reflect.getMetadata("design:type", target, key);
		const propColumnType = getColumnType(propType.name);

		let columnName = snakeCaseTransform(key);
		let columnType = propColumnType;
		let isPartitionKey = false;
		let isClusteringKey = false;
		let clusteringKeySequence = 0;

		if (typeof options === "string") columnName = options;
		else if (typeof options === "object") {
			columnName = options.name || key;
			columnType = options.type || propColumnType;
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
