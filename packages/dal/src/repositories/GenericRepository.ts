import { IBaseModel, IEntity } from '@lingo/domain-model';
import { injectable } from 'inversify';
import mongoose from 'mongoose';

import { IGenericRepository } from './IGenericRepository';

@injectable()
export class GenericRepository<E extends IEntity, M extends IBaseModel> implements IGenericRepository<E, M> {
  private _model: mongoose.Model<M> | undefined;

  public init(model: mongoose.Model<M>): void {
    this._model = model;
  }

  public async findById(id: any | string | number): Promise<M | null> {
    if (this._model === undefined) {
      return Promise.reject(new Error('The model is not found'));
    }

    const result = await this._model.findById(id);

    return result;
  }

  public async findOne(obj: any): Promise<M | null> {
    if (this._model === undefined) {
      return Promise.reject(new Error('The model is not found'));
    }

    const result = await this._model.findOne(obj);

    return result;
  }

  public async create(entity: E): Promise<M> {
    if (this._model === undefined) {
      return Promise.reject(new Error('The model is not found'));
    }

    const result = await this._model.create(entity);

    return result;
  }
}
