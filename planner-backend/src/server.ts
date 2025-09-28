import { buildApp } from './app';
import { ENV } from './env';

async function start() {
  const app = await buildApp();
  app.listen({ port: ENV.port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server running at ${address}`);
  });
}

start();
