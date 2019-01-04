import { IUserModel } from '@lingo/domain-model';
import { authorizationErrors } from '@lingo/validator';
import { Request, Response } from 'express';
import passport from 'passport';

export const executeWithUserValidation = (
  req: Request,
  res: Response,
  handler: (req: Request, res: Response, user: IUserModel) => Promise<Response | void | undefined> | void
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const authRequest = passport.authenticate('jwt', { session: false }, async (error: any, user?: any, info?: any) => {
      if (user) {
        handler(req, res, user);
        resolve(true);
      } else {
        res.status(401).json({ errors: authorizationErrors['authorization-failed'] });
        resolve(false);
      }
    });

    authRequest(req, res);
  });
};
