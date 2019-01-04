import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { DIType } from '@lingo/domain-model';

import { IApp } from './app';
import commonContainer from './bootstrap';
import config from './config/server.config';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';

const app = commonContainer.get<IApp>(DIType.APPLICATION);
const expressApp = app.init();

const context = (req: any) => {
  // tslint:disable-next-line:no-console
  console.log(req);
};

const apollo = new ApolloServer({
  context: ({ req }: any) => context(req),
  resolvers,
  typeDefs,
});

apollo.applyMiddleware({ app: expressApp });

let server: http.Server | https.Server;
if (config.ssl) {
  server = https.createServer(
    {
      cert: fs.readFileSync('.config/ssl/production/server.crt'),
      key: fs.readFileSync('.config/ssl/production/server.key'),
    },
    expressApp
  );

  // apollo.installSubscriptionHandlers(server);
} else {
  server = http.createServer(expressApp);

  apollo.installSubscriptionHandlers(server);
}

export default server;
