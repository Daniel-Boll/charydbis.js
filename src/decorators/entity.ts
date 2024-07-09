import { BaseEntity } from "../entity/base";
import { snakeCaseTransform } from "../utils/snake-case-transform";

interface TableOptions {
  compaction?: CompactionType;
}

// NOTE: We should watch if this enum shouldn't be moved to the driver itself. It depends on the driver implementation needing the same info.
enum CompactionType {
  TimeWindowCompactionStrategy = 0,
  SizeTieredCompactionStrategy = 1,
  LeveledCompactionStrategy = 2,
  IncrementalCompactionStrategy = 3,
}

export function Entity(tableName?: string, options?: TableOptions) {
  return (entity: Function) => {
    entity.prototype.tableName = tableName ?? snakeCaseTransform(entity.name);
    entity.prototype.__proto__ = BaseEntity.prototype;

    if (options?.compaction) entity.prototype.compaction = options;
  };
}
