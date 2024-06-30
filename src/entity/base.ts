import type { ColumnDefinition } from "../decorators";

export interface BaseEntityConstructor {
	new (): BaseEntity;
	columns?: ColumnDefinition[];
}

export class BaseEntity {
	constructor() {
		const columns = (this.constructor as BaseEntityConstructor).columns ?? [];
		for (const col of columns) {
			// @ts-ignore: Object has no index signature
			this[col.key] = undefined;
		}
	}
}
