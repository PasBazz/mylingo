import { IEmailMessage, IEmailSetting } from './interfaces';

export class ResetPasswordEmail implements IEmailMessage {
  public readonly to: string;
  public readonly text: string;
  public readonly subject: string;
  public readonly html: string;

  constructor(setting: IEmailSetting) {
    this.to = setting.email;

    this.text = '';
    this.subject = '';
    this.html = '';
  }
}
