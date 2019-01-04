import { IDbConnection } from '@lingo/dal';
import { DIType, IProfile, IProfileModel, IUser, IUserModel } from '@lingo/domain-model';
import { IEmailMessagesFactory, IEmailService } from '@lingo/email-service';
import { loginErrors, profileErrors, registrationErrors, validateLogin, validateRegister } from '@lingo/validator';
import { compare, genSalt, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import { url } from 'gravatar';
import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import 'reflect-metadata';

import { getSecretKey } from '../helpers/environment.helper';

export interface IAuthController {
  register(req: Request, res: Response): void;
  activate(req: Request, res: Response): void;
  login(req: Request, res: Response): void;
  current(req: Request, res: Response, user: IUserModel): void;
}

@injectable()
export class AuthController implements IAuthController {
  private _emailService: IEmailService;
  private _emailFactory: IEmailMessagesFactory;
  private _connection: IDbConnection;

  public constructor(
    @inject(DIType.EMAIL_SERVICE) emailService: IEmailService,
    @inject(DIType.EMAIL_MESSAGES_FACTORY) emailFactory: IEmailMessagesFactory,
    @inject(DIType.DB_CONNECTION) connection: IDbConnection
  ) {
    this._emailService = emailService;
    this._emailFactory = emailFactory;
    this._connection = connection;
  }

  public register = async (req: Request, res: Response) => {
    try {
      const validResult = validateRegister(req.body);

      if (!validResult.isValid) {
        return res.status(400).json(validResult.errors);
      }

      const userRepository = this._connection.getRepository<IUser, IUserModel>('users');
      const profileRepository = this._connection.getRepository<IProfile, IProfileModel>('profiles');

      const existingUser = await userRepository.findOne({ email: req.body.email });
      if (existingUser !== null) {
        return res.status(400).json({ errors: registrationErrors['email-exists'] });
      }

      const salt = await genSalt(12);
      const hashValue = await hash(req.body.password, salt);

      const avatar = url(req.body.email, {
        default: 'mm',
        rating: '.pg',
        size: '200',
      });

      const newUser = {
        email: req.body.email,
        name: req.body.name,
        password: hashValue,
      };

      const user = await userRepository.create(newUser);

      const token = sign({ id: user.id }, getSecretKey(), { expiresIn: '10 days' });

      const newProfile = {
        activateToken: token,
        avatar,
        user: user.id,
      };

      await profileRepository.create(newProfile);

      const host = req.get('host') || '';
      const protocol = req.protocol;

      const message = this._emailFactory.create('confirm email', { email: newUser.email, protocol, host, userName: newUser.name, token });

      const result = await this._emailService.send(message);

      res.json({ result });
    } catch (error) {
      return res.status(500).json({ errors: registrationErrors['registration-failed'] });
    }
  };

  public activate = async (req: Request, res: Response) => {
    try {
      verify(req.params.token, getSecretKey());

      const userRepository = this._connection.getRepository<IUser, IUserModel>('users');
      const profileRepository = this._connection.getRepository<IProfile, IProfileModel>('profiles');

      const existingProfile = await profileRepository.findOne({ activateToken: req.params.token });

      if (existingProfile === null) {
        return res.status(400).json({ errors: profileErrors['profile-is-not-found'] });
      }

      const existingUser = await userRepository.findById(existingProfile.user);

      if (existingUser === null) {
        return res.status(400).json({ errors: loginErrors['user-is-not-found'] });
      }

      existingProfile.activateToken = '';
      existingProfile.isActivated = true;

      const result = await existingProfile.save();

      res.json({
        payload: {
          profile: { id: result._id, avatar: result.avatar },
          user: { id: existingUser.id, name: existingUser.name, email: existingUser.email },
        },
        result: true,
      });
    } catch (error) {
      res.status(500).json({ errors: profileErrors['activation-failed'] });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const validResult = validateLogin(req.body);

      if (!validResult.isValid) {
        return res.status(400).json(validResult.errors);
      }

      const userRepository = this._connection.getRepository<IUser, IUserModel>('users');

      const email = req.body.email;
      const password = req.body.password;

      const existingUser = await userRepository.findOne({ email });

      if (existingUser === null) {
        return res.status(400).json({ errors: loginErrors['user-is-not-found'] });
      }

      const result = await compare(password, existingUser.password);

      const payload = {
        id: existingUser.id,
        name: existingUser.name,
      };

      if (result) {
        const token = sign(payload, getSecretKey(), { expiresIn: '1h' });
        res.json({ result: true, payload: { token: `Bearer ${token}` } });
      } else {
        res.status(400).json({ errors: loginErrors['password-incorrect'] });
      }
    } catch (error) {
      res.status(500).json({ errors: loginErrors['login-failed'] });
    }
  };

  public current = (req: Request, res: Response, user: IUserModel) => {
    res.json({
      payload: {
        user: { id: user.id, name: user.name, email: user.email },
      },
      result: true,
    });
  };
}
