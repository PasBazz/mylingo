import { IDbConnection } from '@lingo/dal';
import { DIType, IUser, IUserModel } from '@lingo/domain-model';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { getSecretKey } from '../helpers/environment.helper';

import container from '../bootstrap';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getSecretKey(),
};

const findUser = (connection: IDbConnection) => async (payload: any, done: VerifiedCallback) => {
  try {
    const repository = connection.getRepository<IUser, IUserModel>('users');

    const user = await repository.findById(payload.id);

    if (user) {
      done(null, user);
    } else {
      done(null, false, {
        message: 'Invalid email or password.',
      });
    }
  } catch (error) {
    done(error);
  }
};

export const configureJwtStrategy = () => {
  const connection = container.get<IDbConnection>(DIType.DB_CONNECTION);

  const strategy = new Strategy(options, findUser(connection));

  passport.use(strategy);
};
