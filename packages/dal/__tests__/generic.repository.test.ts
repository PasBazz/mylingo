import { GenericRepository } from '@lingo/dal';
import { IUser, IUserModel } from '@lingo/domain-model';
import { getMongooseModelInst } from './helpers/mock.factory';

describe('Generic repository unit tests', () => {
  it('Should run init without exception', () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    const model = getMongooseModelInst<IUserModel>();

    expect(() => repository.init(model)).not.toThrow();
  });

  it('Should find model by id successfully', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    const mongooseMode = getMongooseModelInst<IUserModel>({ findById: jest.fn() });

    repository.init(mongooseMode);

    const id = '123';

    await repository.findById(id);

    expect(mongooseMode.findById).toBeCalledTimes(1);
    expect(mongooseMode.findById).toBeCalledWith(id);
  });

  it('Should find model by id unsuccessfully because because the function threw exceptions', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    expect.assertions(1);

    await expect(repository.findById('123')).rejects.toEqual(new Error('The model is not found'));
  });

  it('Should find one model successfully', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    const mongooseMode = getMongooseModelInst<IUserModel>({ findOne: jest.fn() });

    repository.init(mongooseMode);

    const email = 'user@gmail.com';

    await repository.findOne({ email });

    expect(mongooseMode.findOne).toBeCalledTimes(1);
    expect(mongooseMode.findOne).toBeCalledWith({ email });
  });

  it('Should find one model unsuccessfully because because the function threw exceptions', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    expect.assertions(1);

    await expect(repository.findOne({ email: 'user@gmail.com' })).rejects.toEqual(new Error('The model is not found'));
  });

  it('Should create a new model successfully', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    const mongooseMode = getMongooseModelInst<IUserModel>({ findById: jest.fn() });

    repository.init(mongooseMode);

    const newUser: IUser = {
      email: 'user@gmail.com',
      name: 'user',
      password: 'qwerty',
    };

    await repository.create(newUser);

    expect(mongooseMode.create).toBeCalledTimes(1);
    expect(mongooseMode.create).toBeCalledWith(newUser);
  });

  it('Should create a new model unsuccessfully because because the function threw exceptions', async () => {
    const repository = new GenericRepository<IUser, IUserModel>();

    expect.assertions(1);

    const newUser: IUser = {
      email: 'user@gmail.com',
      name: 'user',
      password: 'qwerty',
    };

    await expect(repository.create(newUser)).rejects.toEqual(new Error('The model is not found'));
  });
});
