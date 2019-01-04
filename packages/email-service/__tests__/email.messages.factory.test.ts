import { EmailMessagesFactory, IEmailSetting } from '@lingo/email-service';

describe('Email messages factory unit tests', () => {
  it.each(['confirm email', 'delete account', 'reset password'])('Should set email address correctly', (type) => {
    const factory = new EmailMessagesFactory();

    const setting: IEmailSetting = {
      email: 'user@gmail.com',
      host: 'mylingo',
      protocol: 'http',
      token: '12345',
      userName: 'noname',
    };

    const email = factory.create(type, setting);

    expect(email.to).toBe(setting.email);
  });
});
