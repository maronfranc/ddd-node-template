export interface IQueryOptions<T> {
  select: (keyof T)[];
}
