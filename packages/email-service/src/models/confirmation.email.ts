import { IEmailMessage, IEmailSetting } from './interfaces';

export class ConfirmationEmail implements IEmailMessage {
  public readonly to: string;
  public readonly text: string;
  public readonly subject: string;
  public readonly html: string;

  constructor(setting: IEmailSetting) {
    this.to = setting.email;
    this.text = `Здравствуйте, ${
      setting.userName
    }. Вы успешно зарегистрированы на сервисе Mylingo.com. Для активации учётной записи, пожалуйста, перейдите по ссылке`;
    this.subject = 'Активация учетной записи';

    this.html =
      `<p>Здравствуйте, ${setting.userName}.</p>` +
      '<p>Вы успешно зарегистрированы на сервисе Mylingo.com.<br />' +
      `Для активации учётной записи, пожалуйста, перейдите по <a href="${setting.protocol}//${setting.host}/users/activate/?token=${
        setting.token
      }">ссылке</a></p>`;
  }
}
