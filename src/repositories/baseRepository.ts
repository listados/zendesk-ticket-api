import { IBaseRepository } from '../interfaces/baseRepositoryInterface';
import { Document, Model } from 'mongoose';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public getModel(): Model<T> {
    return this.model;
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.model.find().lean().exec() as T[];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Erro ao buscar registros: ${err.message}`);
      } else {
        throw new Error('Erro desconhecido ao buscar registros');
      }
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).lean().exec() as T | null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Erro ao buscar o registro com _id ${id}: ${err.message}`);
      } else {
        throw new Error('Erro desconhecido ao buscar o registro');
      }
    }
  }

  async findOne(field: string, value: any): Promise<T | null> {
    try {
      const query: any = {};
      query[field] = value;
      return await this.model.findOne(query).lean().exec() as T | null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Erro ao buscar o registro pelo campo ${field}: ${err.message}`);
      } else {
        throw new Error('Erro desconhecido ao buscar o registro');
      }
    }
  }
}
