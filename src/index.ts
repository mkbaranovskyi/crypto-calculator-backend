import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { connectToDB } from './shared/database';
import { registerGlobal } from './shared/error-handler';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LoggerInstance } from './shared/services/logger';

const ajv = new Ajv({
  strict: true,
  strictTypes: true,
  removeAdditional: true,
  useDefaults: true,
  allErrors: true,
});
ajvFormats(ajv, ['email']);

const PORT = Number(process.env.PORT) ?? 5001;
const server = fastify({ logger: LoggerInstance });

const start = async () => {
  registerGlobal(server);
  registerFastifySwagger(server);
  await connectToDB();
  await server.register(endpointRouter);
  await server.listen({ port: PORT, host: '0.0.0.0' });
};

start();
