import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { connectToDB } from './shared/database';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LocalStorage } from './shared/services';


const PORT = Number(process.env.PORT) ?? 5000;
const server = fastify({ logger: true });

const start = async () => {
  LocalStorage.initAsyncLocalStorage();
  registerFastifySwagger(server);
  await server.register(endpointRouter);
  await connectToDB();
  await server.listen({ port: PORT, host: '0.0.0.0' });
};

start();
