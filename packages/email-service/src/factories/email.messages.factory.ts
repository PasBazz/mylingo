import { injectable } from 'inversify';
import 'reflect-metadata';

import { ConfirmationEmail, DeleteAccountEmail, IEmailMessage, IEmailSetting, ResetPasswordEmail } from '../models';

type EmailMessageType = 'confirm email' | 'reset password' | 'delete account';

export interface IEmailMessagesFactory {
  create(type: EmailMessageType, setting: IEmailSetting): IEmailMessage;
}

@injectable()
export class EmailMessagesFactory implements IEmailMessagesFactory {
  public create(type: EmailMessageType, setting: IEmailSetting): IEmailMessage {
    switch (type) {
      case 'confirm email':
        return new ConfirmationEmail(setting);

      case 'reset password':
        return new ResetPasswordEmail(setting);

      case 'delete account':
        return new DeleteAccountEmail(setting);
    }
  }
}
