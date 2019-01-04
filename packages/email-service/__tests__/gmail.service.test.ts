import { EmailMessagesFactory, GmailService, IEmailSetting } from '@lingo/email-service';

describe('Gmail service unit tests', () => {
  beforeAll(() => {
    process.env.GMAIL_HOST = 'smtp.ethereal.email';
    process.env.GMAIL_PORT = '587';
    process.env.GMAIL_USER = 'q2s57mrdbptv7wor@ethereal.email';
    process.env.GMAIL_PASSWORD = 'Na7rwBC7XSQ9Bwjgrv';
    process.env.GMAIL_SECURE = '';
  });

  it('Should send email correctly', async () => {
    const service = new GmailService();

    const factory = new EmailMessagesFactory();

    const setting: IEmailSetting = {
      email: 'user@gmail.com',
      host: 'mylingo',
      protocol: 'http',
      token: '12345',
      userName: 'noname',
    };

    const email = factory.create('confirm email', setting);

    const result = await service.send(email);

    expect(result).toBeTruthy();
  });

  it('Should not send email because transport has wrong auth options', async () => {
    process.env.NODE_ENV = 'develop';

    const service = new GmailService();

    const factory = new EmailMessagesFactory();

    const setting: IEmailSetting = {
      email: 'user@gmail.com',
      host: 'mylingo',
      protocol: 'http',
      token: '12345',
      userName: 'noname',
    };

    const email = factory.create('confirm email', setting);

    const result = await service.send(email);

    expect(result).toBeFalsy();
  });
});
