import { IBaseModel } from '@lingo/domain-model';
import mongoose from 'mongoose';
import { IEntityContext, IGenericRepository } from '../../src';

function getEntityContext(obj: any): jest.Mock<IEntityContext> {
  const defaultObject = {
    connect: jest.fn().mockReturnValue(true),
    disconnect: jest.fn().mockReturnValue(true),
    getModel: jest.fn().mockReturnValue({}),
  };

  const mock = jest.fn<IEntityContext>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getEntityContextInst(obj: any = {}): IEntityContext {
  const Mock = getEntityContext(obj);

  return new Mock();
}

function getGenericRepository<E, M extends IBaseModel>(obj: any): jest.Mock<IGenericRepository<E, M>> {
  const defaultObject = {
    init: jest.fn(),
  };

  const mock = jest.fn<IGenericRepository<E, M>>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getGenericRepositoryInst<E, M extends IBaseModel>(obj: any = {}): IGenericRepository<E, M> {
  const Mock = getGenericRepository<E, M>(obj);

  return new Mock();
}

function getMongooseModel<T extends IBaseModel>(obj: {}): jest.Mock<mongoose.Model<T>> {
  const defaultObject = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mock = jest.fn<mongoose.Model<T>>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getMongooseModelInst<T extends IBaseModel>(obj: any = {}): mongoose.Model<T> {
  const Mock = getMongooseModel<T>(obj);

  return new Mock();
}
