import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { IDbConnection, IGenericRepository } from '@lingo/dal';
import { DIType, IUser, IUserModel } from '@lingo/domain-model';
import { authorizationErrors } from '@lingo/validator';

import container from '../../src/bootstrap';
import { configureJwtStrategy } from '../../src/config/password';
import { getSecretKey } from '../../src/helpers/environment.helper';
import { executeWithUserValidation } from '../../src/middleware/auth.user.middleware';
import { getDbConnectionInst, getGenericRepositoryInst, getMongooseModelInst, getRequestInst, getResponseInst } from '../helpers/mock.factory';

describe('Auth user middleware unit tests', () => {
  const mockUser = {
    email: 'user@gmail.com',
    id: new mongoose.Types.ObjectId(),
    name: 'user',
    password: 'qwerty',
  };

  let request: Request;
  let response: Response;
  let connection: IDbConnection;
  let userRepository: IGenericRepository<IUser, IUserModel>;

  beforeEach(() => {
    request = getRequestInst();
    response = getResponseInst();

    container.unbind(DIType.DB_CONNECTION);

    const userModel = getMongooseModelInst<IUserModel>({ ...mockUser });

    userRepository = getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(userModel),
    });

    connection = getDbConnectionInst({
      getRepository: jest.fn().mockImplementation(() => {
        return userRepository;
      }),
    });

    container.bind<IDbConnection>(DIType.DB_CONNECTION).toConstantValue(connection);
  });

  it('Authorization should succeed', async () => {
    const payload = {
      id: mockUser.id,
      name: mockUser.name,
    };

    const token = sign(payload, getSecretKey(), { expiresIn: '1h' });

    request.headers = {
      authorization: `Bearer ${token}`,
    };

    const callback = jest.fn();

    configureJwtStrategy();

    await expect(executeWithUserValidation(request, response, callback)).resolves.toBe(true);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(request, response, expect.objectContaining(mockUser));
  });

  it('Authorization should fail because headers do not have an authorization token', async () => {
    const callback = jest.fn();

    configureJwtStrategy();

    await executeWithUserValidation(request, response, callback);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(401);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: authorizationErrors['authorization-failed'] });
  });

  it('Authorization should fail because headers have an invalid authorization token', async () => {
    request.headers = {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXIiOiIvL3d3dy5ncmF2YXRhci5jb20vYXZhdGFyL2FiOTYwZjJiM2FhNGI1MTYwYzA3YjU4NzE0NzVhYzQyP2RlZmF1bHQ9bW0mcmF0aW5nPS5wZyZzaXplPTIwMCIsImlkIjoiNWI1MzYwODFlMzY0YWMwMGU0MWRiMmQxIiwibmFtZSI6Ikl2YW4gSXZhbm92IiwiaWF0IjoxNTMyMjQwMDU3LCJleHAiOjE1MzIyNDM2NTd9.XZuptDn6iHUdwpat_jKrJx1tyH9VIKlKFTm0cMszkds',
    };

    const callback = jest.fn();

    configureJwtStrategy();

    await executeWithUserValidation(request, response, callback);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(401);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: authorizationErrors['authorization-failed'] });
  });

  it('Authorization should fail because the user was not found', async () => {
    userRepository = getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(undefined),
    });

    const payload = {
      id: mockUser.id,
      name: mockUser.name,
    };

    const token = sign(payload, getSecretKey(), { expiresIn: '1h' });

    request.headers = {
      authorization: `Bearer ${token}`,
    };

    const callback = jest.fn();

    configureJwtStrategy();

    await executeWithUserValidation(request, response, callback);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(401);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: authorizationErrors['authorization-failed'] });
  });

  it('Authorization should fail because the function getRepository throw an exception', async () => {
    container.unbind(DIType.DB_CONNECTION);

    connection = getDbConnectionInst({
      getRepository: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    });

    container.bind<IDbConnection>(DIType.DB_CONNECTION).toConstantValue(connection);

    const payload = {
      id: mockUser.id,
      name: mockUser.name,
    };

    const token = sign(payload, getSecretKey(), { expiresIn: '1h' });

    request.headers = {
      authorization: `Bearer ${token}`,
    };

    const callback = jest.fn();

    configureJwtStrategy();

    await executeWithUserValidation(request, response, callback);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(401);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: authorizationErrors['authorization-failed'] });
  });
});
