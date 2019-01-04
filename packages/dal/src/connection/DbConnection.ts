import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DIType, IBaseModel, IEntity, ModelType } from '@lingo/domain-model';

import { IEntityContext } from '../context/IEntityContext';
import { IGenericRepository } from '../repositories';
import { IDbConnection } from './IDbConnection';

@injectable()
export class DbConnection implements IDbConnection {
  private _entityContext: IEntityContext;
  private _factory: <E extends IEntity, M extends IBaseModel>(type: ModelType) => IGenericRepository<E, M>;
  private _repositories: Map<ModelType, IGenericRepository<IEntity, IBaseModel>>;

  constructor(
    @inject(DIType.ENTITY_CONTEXT) entityContext: IEntityContext,
    @inject(DIType.REPOSITORY_FACTORY) factory: () => <E extends IEntity, M extends IBaseModel>(type: ModelType) => IGenericRepository<E, M>
  ) {
    this._entityContext = entityContext;
    this._factory = factory();

    this._repositories = new Map();
  }

  public connect(path: string, isDebug: boolean): Promise<boolean> {
    return this._entityContext.connect(
      path,
      isDebug
    );
  }

  public disconnect(): Promise<boolean> {
    return this._entityContext.disconnect();
  }

  public getRepository<E extends IEntity, M extends IBaseModel>(type: ModelType): IGenericRepository<E, M> {
    if (this._repositories.has(type)) {
      return this._repositories.get(type) as IGenericRepository<E, M>;
    }

    const model = this._entityContext.getModel<M>(type);

    if (model === undefined) {
      throw new Error(`Model ${type} was not found`);
    }

    const repository = this._factory<E, M>(type);

    repository.init(model);

    this._repositories.set(type, repository);

    return repository;
  }
}
