import {
  DIType,
  IBaseModel,
  IEntity,
  IProfile,
  IProfileModel,
  IUser,
  IUserModel,
  ModelType,
  ProfileModelType,
  UserModelType,
} from '@lingo/domain-model';

import { Container, interfaces } from 'inversify';
import 'reflect-metadata';

import { DbConnection, IDbConnection } from './connection';
import { EntityContext, IEntityContext } from './context';
import { GenericRepository, IGenericRepository } from './repositories';

export const container = new Container();

const userModelType: UserModelType = 'users';
const profileModelType: ProfileModelType = 'profiles';

container
  .bind<IEntityContext>(DIType.ENTITY_CONTEXT)
  .to(EntityContext)
  .inSingletonScope();

container.bind<IGenericRepository<IUser, IUserModel>>(userModelType).to(GenericRepository);

container.bind<IGenericRepository<IProfile, IProfileModel>>(profileModelType).to(GenericRepository);

container
  .bind<interfaces.Factory<IGenericRepository<IEntity, IBaseModel>>>(DIType.REPOSITORY_FACTORY)
  .toFactory<IGenericRepository<IEntity, IBaseModel>>((context) => {
    return () => <E extends IEntity, M extends IBaseModel>(type: ModelType) => {
      const repository = context.container.get<IGenericRepository<E, M>>(type);

      return repository;
    };
  });

container
  .bind<IDbConnection>(DIType.DB_CONNECTION)
  .to(DbConnection)
  .inSingletonScope();
