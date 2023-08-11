type Obj = Record<string, any>;
export interface IQueryOptions<T extends Obj> {
  select: (keyof T)[];
}
export type IQueryOptionsSelect<T extends Obj> = Pick<IQueryOptions<T>, 'select'>;
