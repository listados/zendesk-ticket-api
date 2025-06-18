export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;

  findById(id: string): Promise<T | null>;

  findOne(field: string, value: any): Promise<T | null>;
}
