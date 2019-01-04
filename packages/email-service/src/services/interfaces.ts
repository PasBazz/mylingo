import { IEmailMessage } from '../models';

export interface IEmailService {
  send(message: IEmailMessage): Promise<boolean>;
}
