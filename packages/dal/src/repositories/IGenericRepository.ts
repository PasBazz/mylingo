import { IBaseModel, IEntity } from '@lingo/domain-model';
import mongoose from 'mongoose';

export interface IGenericRepository<E extends IEntity, M extends IBaseModel> {
  init(model: mongoose.Model<M>): void;
  create(entity: E): Promise<M>;
  findById(id: any | string | number): Promise<M | null>;
  findOne(obj: any): Promise<M | null>;
}
