import mongoose from 'mongoose';
import 'reflect-metadata';
import { agent, Response } from 'supertest';

import { IDbConnection } from '@lingo/dal';

import { App, IApp } from '../src/app';
import { IAuthController } from '../src/controllers/auth.controller';
import { IUserRoute, UserRoute } from '../src/routes/api/users.route';
import { getAuthControllerInst, getDbConnectionInst } from './helpers/mock.factory';

describe('App unit tests', () => {
  let app: IApp;
  let connection: IDbConnection;
  let usersRoute: IUserRoute;
  let authController: IAuthController;

  beforeEach(() => {
    connection = getDbConnectionInst();
    authController = getAuthControllerInst();
    usersRoute = new UserRoute(authController);
    app = new App(connection, usersRoute);
    app.init();
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('Should return status 200', async () => {
    const response: Response = await agent(app.expressApp).get('/');
    expect(response.status).toBe(200);
  });

  it('Should call register', async () => {
    await agent(app.expressApp).post('/api/users/register');

    expect(authController.register).toBeCalled();
  });

  it('Should call activate', async () => {
    await agent(app.expressApp).post('/api/users/activate:mock_token');

    expect(authController.activate).toBeCalled();
  });

  it('Should call login', async () => {
    await agent(app.expressApp).post('/api/users/login');

    expect(authController.login).toBeCalled();
  });
});
