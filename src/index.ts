import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { connectToDB } from './shared/database';
import { registerGlobal } from './shared/error-handler';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LoggerInstance } from './shared/services/logger';

const PORT = Number(process.env.PORT) ?? 5000;
const server = fastify({ logger: LoggerInstance });

const start = async () => {
  registerGlobal(server);
  registerFastifySwagger(server);
  await server.register(endpointRouter);
  await connectToDB();
  await server.listen({ port: PORT, host: '0.0.0.0' });
};

start();
