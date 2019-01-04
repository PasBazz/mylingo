import { genSalt, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { IDbConnection, IGenericRepository } from '@lingo/dal';
import { IProfile, IProfileModel, IUser, IUserModel } from '@lingo/domain-model';
import { IEmailMessagesFactory, IEmailService } from '@lingo/email-service';
import { loginErrors, profileErrors, registrationErrors, validationErrors } from '@lingo/validator';

import { AuthController } from '../../src/controllers/auth.controller';
import { getSecretKey } from '../../src/helpers/environment.helper';
import * as mockFactory from '../helpers/mock.factory';

const mockPassword = 'qwerty';

const mockUser = {
  email: 'user@gmail.com',
  id: new mongoose.Types.ObjectId(),
  name: 'user',
  password: mockPassword,
};

const mockToken = sign({ id: mockUser.id }, getSecretKey(), { expiresIn: '10 days' });

const mockProfile = {
  _id: new mongoose.Types.ObjectId(),
  activateToken: mockToken,
  avatar: 'mock_avatar',
  isActivated: false,
  user: mockUser.id,
};

let request: Request;
let response: Response;
let emailService: IEmailService;
let messagesFactory: IEmailMessagesFactory;
let userModel: IUserModel;
let profileModel: IProfileModel;
let userRepository: IGenericRepository<IUser, IUserModel>;
let profileRepository: IGenericRepository<IProfile, IProfileModel>;
let connection: IDbConnection;

describe('Auth controller unit tests. New user registration.', () => {
  beforeEach(() => {
    request = mockFactory.getRequestInst();
    response = mockFactory.getResponseInst();
    emailService = mockFactory.getMockEmailServiceInst();
    messagesFactory = mockFactory.getEmailMessagesFactoryInst();
    userModel = mockFactory.getMongooseModelInst<IUserModel>({ ...mockUser });
    profileRepository = mockFactory.getGenericRepositoryInst<IProfile, IProfileModel>();
  });

  it('New user should be registered successfully', async () => {
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      create: jest.fn().mockReturnValue(userModel),
      findOne: jest.fn().mockReturnValue(null),
    });
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        return type === 'users' ? userRepository : profileRepository;
      }),
    });

    request.body = {
      email: mockUser.email,
      name: mockUser.name,
      password: mockUser.password,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.register(request, response);

    expect(connection.getRepository).toBeCalledTimes(2);

    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(userRepository.findOne).toBeCalledWith({ email: mockUser.email });

    expect(userRepository.create).toBeCalledTimes(1);
    expect(userRepository.create).toBeCalledWith({ email: mockUser.email, name: mockUser.name, password: expect.any(String) });

    expect(profileRepository.create).toBeCalledTimes(1);
    expect(profileRepository.create).toBeCalledWith({ activateToken: expect.any(String), avatar: expect.any(String), user: mockUser.id });

    expect(messagesFactory.create).toBeCalledTimes(1);
    expect(messagesFactory.create).toBeCalledWith('confirm email', {
      email: request.body.email,
      host: 'localhost',
      protocol: request.protocol,
      token: expect.any(String),
      userName: request.body.name,
    });

    expect(emailService.send).toBeCalledTimes(1);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ result: true });
  });

  it('New user should be registered unsuccessfully because request body does not have registration data', async () => {
    connection = mockFactory.getDbConnectionInst();

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.register(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      email: validationErrors['email-is-empty'],
      name: validationErrors['name-is-empty'],
      password: validationErrors['password-is-empty'],
    });
  });

  it('New user should be registered unsuccessfully because the new user exists', async () => {
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      findOne: jest.fn().mockReturnValue(userModel),
    });
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        return type === 'users' ? userRepository : profileRepository;
      }),
    });

    request.body = {
      email: mockUser.email,
      name: mockUser.name,
      password: mockUser.password,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.register(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: registrationErrors['email-exists'] });
  });

  it('New user should be registered unsuccessfully because the function getRepository throw an exception', async () => {
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        throw new Error('');
      }),
    });

    request.body = {
      email: mockUser.email,
      name: mockUser.name,
      password: mockUser.password,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.register(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(500);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: registrationErrors['registration-failed'] });
  });
});

describe('Auth controller unit tests. New user activation.', () => {
  beforeEach(() => {
    request = mockFactory.getRequestInst();
    response = mockFactory.getResponseInst();
    emailService = mockFactory.getMockEmailServiceInst();
    messagesFactory = mockFactory.getEmailMessagesFactoryInst();
    userModel = mockFactory.getMongooseModelInst<IUserModel>({ ...mockUser });
    profileModel = mockFactory.getMongooseModelInst<IProfileModel>({ ...mockProfile });
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(userModel),
      findOne: jest.fn().mockReturnValue(userModel),
    });
    profileRepository = mockFactory.getGenericRepositoryInst<IProfile, IProfileModel>({
      findById: jest.fn().mockReturnValue(profileModel),
      findOne: jest.fn().mockReturnValue(profileModel),
    });
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        return type === 'users' ? userRepository : profileRepository;
      }),
    });
  });

  it('New user should be activated successfully', async () => {
    const controller = new AuthController(emailService, messagesFactory, connection);

    request.params = {
      token: mockToken,
    };

    await controller.activate(request, response);

    expect(profileModel.isActivated).toBeTruthy();
    expect(profileModel.activateToken).toBe('');

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      payload: {
        profile: { id: mockProfile._id, avatar: mockProfile.avatar },
        user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
      },
      result: true,
    });
  });

  it('New user should be activated unsuccessfully because the token is not valid', async () => {
    const controller = new AuthController(emailService, messagesFactory, connection);

    const token = sign({ id: mockUser.id }, 'wrong_secret', { expiresIn: '10 days' });

    request.params = {
      token,
    };

    await controller.activate(request, response);

    expect(profileModel.isActivated).toBeFalsy();
    expect(profileModel.activateToken).toBe(mockToken);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(500);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: profileErrors['activation-failed'] });
  });

  it('New user should be activated unsuccessfully because the profile is not found', async () => {
    profileRepository = mockFactory.getGenericRepositoryInst<IProfile, IProfileModel>({
      findById: jest.fn().mockReturnValue(null),
      findOne: jest.fn().mockReturnValue(null),
    });

    const controller = new AuthController(emailService, messagesFactory, connection);

    request.params = {
      token: mockToken,
    };

    await controller.activate(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: profileErrors['profile-is-not-found'] });
  });

  it('New user should be activated unsuccessfully because the user is not found', async () => {
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(null),
      findOne: jest.fn().mockReturnValue(null),
    });

    const controller = new AuthController(emailService, messagesFactory, connection);

    request.params = {
      token: mockToken,
    };

    await controller.activate(request, response);

    expect(mockProfile.isActivated).toBeFalsy();
    expect(mockProfile.activateToken).toBe(mockToken);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: loginErrors['user-is-not-found'] });
  });
});

describe('Auth controller unit tests. Login.', () => {
  beforeEach(async () => {
    const salt = await genSalt(12);
    const hashValue = await hash(mockPassword, salt);

    mockUser.password = hashValue;

    request = mockFactory.getRequestInst();
    response = mockFactory.getResponseInst();
    emailService = mockFactory.getMockEmailServiceInst();
    messagesFactory = mockFactory.getEmailMessagesFactoryInst();
    userModel = mockFactory.getMongooseModelInst<IUserModel>({ ...mockUser });
    profileModel = mockFactory.getMongooseModelInst<IProfileModel>({ ...mockProfile });
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(userModel),
      findOne: jest.fn().mockReturnValue(userModel),
    });
    profileRepository = mockFactory.getGenericRepositoryInst<IProfile, IProfileModel>({
      findById: jest.fn().mockReturnValue(profileModel),
      findOne: jest.fn().mockReturnValue(profileModel),
    });
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        return type === 'users' ? userRepository : profileRepository;
      }),
    });
  });

  it('Current user should log in successfully', async () => {
    request.body = {
      email: mockUser.email,
      password: mockPassword,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.login(request, response);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      payload: {
        token: expect.any(String),
      },
      result: true,
    });
  });

  it('Current user should log in unsuccessfully because request body does not have user data', async () => {
    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.login(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      email: validationErrors['email-is-empty'],
      password: validationErrors['password-is-empty'],
    });
  });

  it('Current user should log in unsuccessfully because the user is not found ', async () => {
    userRepository = mockFactory.getGenericRepositoryInst<IUser, IUserModel>({
      findById: jest.fn().mockReturnValue(null),
      findOne: jest.fn().mockReturnValue(null),
    });

    request.body = {
      email: mockUser.email,
      password: mockPassword,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.login(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: loginErrors['user-is-not-found'] });
  });

  it('Current user should log in unsuccessfully because password incorrect', async () => {
    request.body = {
      email: mockUser.email,
      password: '123456',
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.login(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(400);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: loginErrors['password-incorrect'] });
  });

  it('Current user should log in unsuccessfully because the function getRepository throw an exception', async () => {
    connection = mockFactory.getDbConnectionInst({
      getRepository: jest.fn().mockImplementation((type: string) => {
        throw new Error('');
      }),
    });

    request.body = {
      email: mockUser.email,
      password: mockPassword,
    };

    const controller = new AuthController(emailService, messagesFactory, connection);

    await controller.login(request, response);

    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(500);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ errors: loginErrors['login-failed'] });
  });
});

describe('Auth controller unit tests. Get current user.', () => {
  beforeEach(() => {
    request = mockFactory.getRequestInst();
    response = mockFactory.getResponseInst();
    userModel = mockFactory.getMongooseModelInst<IUserModel>({ ...mockUser });
  });

  it('Should return current user', () => {
    const controller = new AuthController(emailService, messagesFactory, connection);

    controller.current(request, response, userModel);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      payload: {
        user: {
          email: userModel.email,
          id: userModel.id,
          name: userModel.name,
        },
      },
      result: true,
    });
  });
});
