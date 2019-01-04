import { Request, Response } from 'express';

import { IDbConnection, IGenericRepository } from '@lingo/dal';
import { IBaseModel } from '@lingo/domain-model';
import { IEmailMessage, IEmailMessagesFactory, IEmailService } from '@lingo/email-service';

import { IAuthController } from '../../src/controllers/auth.controller';

function getMockEmailService(obj: any): jest.Mock<IEmailService> {
  const defaultObject = {
    send: jest.fn().mockReturnValue(true),
  };

  const mock = jest.fn<IEmailService>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getMockEmailServiceInst(obj: any = {}): IEmailService {
  const Mock = getMockEmailService(obj);

  return new Mock();
}

function getEmailMessagesFactory(obj: any): jest.Mock<IEmailMessagesFactory> {
  const message: IEmailMessage = { to: 'user@gmail.com' };

  const defaultObject = {
    create: jest.fn().mockReturnValue(message),
  };

  const mock = jest.fn<IEmailMessagesFactory>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getEmailMessagesFactoryInst(obj: any = {}): IEmailMessagesFactory {
  const Mock = getEmailMessagesFactory(obj);

  return new Mock();
}

function getRequest(obj: {}): jest.Mock<Request> {
  const defaultObject = {
    body: {},
    headers: [],
    params: {},
    protocol: 'http',

    get: jest.fn().mockReturnValue('localhost'),
  };

  const mock = jest.fn<Request>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getRequestInst(obj: any = {}): Request {
  const Mock = getRequest(obj);

  return new Mock();
}

function getResponse(obj: any): jest.Mock<Response> {
  const defaultObject = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  const mock = jest.fn<Response>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getResponseInst(obj: any = {}): Response {
  const Mock = getResponse(obj);

  return new Mock();
}

function getDbConnection(obj: any): jest.Mock<IDbConnection> {
  const defaultObject = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    getRepository: jest.fn(),
  };

  const mock = jest.fn<IDbConnection>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getDbConnectionInst(obj: any = {}): IDbConnection {
  const Mock = getDbConnection(obj);

  return new Mock();
}

function getGenericRepository<E, M extends IBaseModel>(obj: any): jest.Mock<IGenericRepository<E, M>> {
  const defaultObject = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    init: jest.fn(),
  };

  const mock = jest.fn<IGenericRepository<E, M>>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getGenericRepositoryInst<E, M extends IBaseModel>(obj: any = {}): IGenericRepository<E, M> {
  const Mock = getGenericRepository<E, M>(obj);

  return new Mock();
}

function getMongooseModel<T extends IBaseModel>(obj: {}): jest.Mock<T> {
  const defaultObject = {
    create: jest.fn(),
    findById: jest.fn(),
    save: jest.fn().mockReturnThis(),
  };

  const mock = jest.fn<T>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getMongooseModelInst<T extends IBaseModel>(obj: any = {}): T {
  const Mock = getMongooseModel<T>(obj);

  return new Mock();
}

function getAuthController(obj: {}): jest.Mock<IAuthController> {
  function handler(req: Request, resp: Response) {
    resp.sendStatus(200);
  }

  const defaultObject = {
    activate: jest.fn().mockImplementation(handler),
    current: jest.fn().mockImplementation(handler),
    login: jest.fn().mockImplementation(handler),
    register: jest.fn().mockImplementation(handler),
  };

  const mock = jest.fn<IAuthController>(() => ({ ...defaultObject, ...obj }));

  return mock;
}

export function getAuthControllerInst(obj: any = {}): IAuthController {
  const Mock = getAuthController(obj);

  return new Mock();
}
