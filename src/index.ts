import dotenv from 'dotenv';
dotenv.config();
import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { connectToDB } from './shared/database';
import { registerGlobal } from './shared/error-handler';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LocalStorage } from './shared/services';
import { LoggerInstance } from './shared/services/logger';

const PORT = process.env.PORT ?? 5000;
const server = fastify({ logger: LoggerInstance });

const start = async () => {
  registerGlobal(server);

  LocalStorage.initAsyncLocalStorage();
  registerFastifySwagger(server);
  await server.register(endpointRouter);
  await connectToDB();
  server.listen(PORT, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    console.log(`The server started on the PORT ${PORT}!`);
  });
};

start();
