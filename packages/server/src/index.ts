import config from './config/server.config';
import server from './server';

server.listen(config.port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server running on port:${config.port}/`);
});

declare const module: any;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
