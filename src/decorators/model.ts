import { BaseModel } from "../model/base";
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

export function Model(tableName?: string, options?: TableOptions) {
  return (model: Function) => {
    model.prototype.tableName = tableName ?? snakeCaseTransform(model.name);
    model.prototype.__proto__ = BaseModel.prototype;

    if (options?.compaction) model.prototype.compaction = options;
  };
}
