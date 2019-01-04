import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import errorhandler from 'errorhandler';
import express, { Application, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import morgan from 'morgan';
import passport from 'passport';

import { IDbConnection } from '@lingo/dal';
import { DIType } from '@lingo/domain-model';

import { configureJwtStrategy } from './config/password';
import { IUserRoute } from './routes/api/users.route';

export interface IApp {
  expressApp: Application | undefined;

  init(): Application;
}

@injectable()
export class App implements IApp {
  private _connection: IDbConnection;
  private _usersRoute: IUserRoute;
  private _app: Application | undefined;

  get expressApp(): Application | undefined {
    return this._app;
  }

  public constructor(@inject(DIType.DB_CONNECTION) connection: IDbConnection, @inject(DIType.USER_ROUTE) usersRoute: IUserRoute) {
    this._connection = connection;
    this._usersRoute = usersRoute;
  }

  public init(): Application {
    config();

    configureJwtStrategy();

    // Create Express server
    this._app = express();

    this._app.use(errorhandler());

    // Use logger middleware
    this._app.use(morgan('dev'));

    // Body parser middleware
    this._app.use(urlencoded({ extended: false }));
    this._app.use(json());

    // Password middleware
    this._app.use(passport.initialize());
    this._app.use(passport.session());

    // Connect to MongoDB
    const connectionPath = process.env.CONNECTION_PATH || '';
    this._connection.connect(
      connectionPath,
      process.env.NODE_ENV === 'development'
    );

    this._app.get('/', (req: Request, res: Response) => {
      res.sendStatus(200);
    });

    this._app.use('/api/users', this._usersRoute.Router);

    return this._app;
  }
}
