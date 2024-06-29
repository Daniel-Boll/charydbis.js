export class BaseEntity {
  constructor() {
    const columns = (this.constructor as any).columns;
    if (columns) {
      columns.forEach((col: any) => {
        (this as any)[col.key] = null;
      });
    }
  }
}
