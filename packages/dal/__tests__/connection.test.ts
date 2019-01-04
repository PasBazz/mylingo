import { DbConnection } from '@lingo/dal';
import { IUser, IUserModel, ModelType } from '@lingo/domain-model';

import { getEntityContextInst, getGenericRepositoryInst } from './helpers/mock.factory';

describe('DbConnection unit tests', () => {
  it('Should call the function connect successfully', async () => {
    const context = getEntityContextInst();

    const factory = jest.fn().mockReturnValue({});

    const inject = jest.fn().mockReturnValue(factory);

    const connection = new DbConnection(context, inject);

    const path = 'mock path';
    const isDebug = true;

    await connection.connect(
      path,
      isDebug
    );

    expect(context.connect).toBeCalledTimes(1);
    expect(context.connect).toBeCalledWith(path, isDebug);
  });

  it('Should call the function disconnect successfully', async () => {
    const context = getEntityContextInst();

    const factory = jest.fn().mockReturnValue({});

    const inject = jest.fn().mockReturnValue(factory);

    const connection = new DbConnection(context, inject);

    await connection.disconnect();

    expect(context.disconnect).toBeCalledTimes(1);
    expect(context.disconnect).toBeCalledWith();
  });

  it('Should call the function getRepository successfully', async () => {
    const context = getEntityContextInst();

    const mockRepository = getGenericRepositoryInst<IUser, IUserModel>();

    const factory = jest.fn().mockReturnValue(mockRepository);

    const inject = jest.fn().mockReturnValue(factory);

    const connection = new DbConnection(context, inject);

    const type: ModelType = 'users';

    const newRepository = connection.getRepository<IUser, IUserModel>(type);

    expect(newRepository).not.toBeUndefined();

    const existingRepository = connection.getRepository<IUser, IUserModel>(type);

    expect(existingRepository).not.toBeUndefined();

    expect(newRepository).toEqual(existingRepository);

    expect(context.getModel).toBeCalledTimes(1);
    expect(context.getModel).toBeCalledWith(type);

    expect(factory).toBeCalledTimes(1);
    expect(factory).toBeCalledWith(type);

    expect(mockRepository.init).toBeCalledTimes(1);
    expect(mockRepository.init).toBeCalledWith({});
  });

  it('Should not return a repository, as the model is not found', async () => {
    const context = getEntityContextInst({ getModel: jest.fn() });

    const mockRepository = getGenericRepositoryInst<IUser, IUserModel>();

    const factory = jest.fn().mockReturnValue(mockRepository);

    const inject = jest.fn().mockReturnValue(factory);

    const connection = new DbConnection(context, inject);

    const type: ModelType = 'users';

    expect(() => connection.getRepository<IUser, IUserModel>(type)).toThrowError();
  });
});
