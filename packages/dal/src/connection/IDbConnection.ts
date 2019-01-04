import { IBaseModel, IEntity, ModelType } from '@lingo/domain-model';
import { IGenericRepository } from '../repositories';

export interface IDbConnection {
  connect(path: string, isDebug: boolean): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getRepository<E extends IEntity, M extends IBaseModel>(type: ModelType): IGenericRepository<E, M>;
}
