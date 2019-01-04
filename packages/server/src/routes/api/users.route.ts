import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { DIType } from '@lingo/domain-model';

import { IAuthController } from '../../controllers/auth.controller';
import { executeWithUserValidation } from '../../middleware/auth.user.middleware';

export interface IUserRoute {
  Router: Router;
}

@injectable()
export class UserRoute implements IUserRoute {
  private _authController: IAuthController;
  private _router: Router;

  public constructor(@inject(DIType.AUTH_CONTROLLER) authController: IAuthController) {
    this._authController = authController;
    this._router = Router();

    this.init();
  }

  get Router(): Router {
    return this._router;
  }

  private init() {
    // @route   POST api/users/register
    // @desc    New user registration
    // @access  Public
    this._router.post('/register', async (req: Request, res: Response) => {
      this._authController.register(req, res);
    });

    // @route   POST api/users/activate:token
    // @desc    New user activation
    // @access  Public
    this._router.post('/activate:token', async (req: Request, res: Response) => {
      this._authController.activate(req, res);
    });

    // @route   POST api/users/login
    // @desc    Login user and return JWT token
    // @access  Public
    this._router.post('/login', async (req: Request, res: Response) => {
      this._authController.login(req, res);
    });

    // @route   GET api/users/current
    // @desc    Return current user
    // @access  Private
    this._router.get('/current', async (req: Request, res: Response) => {
      executeWithUserValidation(req, res, this._authController.current);
    });
  }
}
