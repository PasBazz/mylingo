import { IDbConnection, IEntityContext, IGenericRepository } from '@lingo/dal';
import { DIType, IBaseModel, IEntity, IProfile, IProfileModel, IUser, IUserModel, ModelType } from '@lingo/domain-model';
import { container } from '../src/bootstrap';

describe('Bootstrap unit tests', () => {
  it('Should get IEntityContext', () => {
    const context = container.get<IEntityContext>(DIType.ENTITY_CONTEXT);

    expect(context).not.toBeUndefined();
  });

  it('Should get UserRepository', () => {
    const type: ModelType = 'users';
    const repository = container.get<IGenericRepository<IUser, IUserModel>>(type);

    expect(repository).not.toBeUndefined();
  });

  it('Should get ProfileRepository', () => {
    const type: ModelType = 'profiles';
    const repository = container.get<IGenericRepository<IProfile, IProfileModel>>(type);

    expect(repository).not.toBeUndefined();
  });

  it('Should get IGenericRepository<IEntity, IBaseModel>>', () => {
    const factory = container.get<IGenericRepository<IEntity, IBaseModel>>(DIType.REPOSITORY_FACTORY);

    expect(factory).not.toBeUndefined();
  });

  it('Should get IDbConnection', () => {
    const connection = container.get<IDbConnection>(DIType.DB_CONNECTION);

    expect(connection).not.toBeUndefined();
  });
});
