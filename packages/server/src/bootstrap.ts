import { Container } from 'inversify';
import 'reflect-metadata';

import { container as dalContainer } from '@lingo/dal';
import { DIType } from '@lingo/domain-model';

import { EmailMessagesFactory, GmailService, IEmailMessagesFactory, IEmailService } from '@lingo/email-service';

import { App, IApp } from './app';
import { AuthController, IAuthController } from './controllers/auth.controller';
import { IUserRoute, UserRoute } from './routes/api/users.route';

const container = new Container();

container.bind<IAuthController>(DIType.AUTH_CONTROLLER).to(AuthController);

container
  .bind<IEmailMessagesFactory>(DIType.EMAIL_MESSAGES_FACTORY)
  .to(EmailMessagesFactory)
  .inSingletonScope();

container
  .bind<IEmailService>(DIType.EMAIL_SERVICE)
  .to(GmailService)
  .inSingletonScope();

container.bind<IUserRoute>(DIType.USER_ROUTE).to(UserRoute);

container
  .bind<IApp>(DIType.APPLICATION)
  .to(App)
  .inSingletonScope();

const commonContainer = Container.merge(container, dalContainer);

export default commonContainer;
