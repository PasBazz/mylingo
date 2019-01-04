import { injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import 'reflect-metadata';

import { IEmailMessage } from '../models';
import { IEmailService } from './interfaces';

@injectable()
export class GmailService implements IEmailService {
  public async send(message: IEmailMessage): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const transporter = this.createTransport();

      transporter.sendMail(message, (error: any, response: any) => {
        transporter.close();
        resolve(error === null);
      });
    });
  }

  private createTransport = (): Transporter => {
    const transporter = nodemailer.createTransport({
      auth: {
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        pass: process.env.GMAIL_PASSWORD,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        type: process.env.NODE_ENV === 'test' ? undefined : 'OAuth2',
        user: process.env.GMAIL_USER,
      },
      host: process.env.GMAIL_HOST,
      port: Number(process.env.GMAIL_PORT),
      secure: Boolean(process.env.GMAIL_SECURE),
    });

    return transporter;
  };
}
