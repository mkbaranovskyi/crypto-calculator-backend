import 'dotenv/config';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { MyDataSource } from './shared/database';
import { registerGlobal } from './shared/error-handler';
import { registerFastifyCookie } from './shared/plugins/cookie';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LoggerInstance } from './shared/services';
import cors from '@fastify/cors';

const ajv = new Ajv({
  strict: true,
  strictTypes: true,
  removeAdditional: true,
  useDefaults: true,
  allErrors: true,
});
ajvFormats(ajv, ['email']);

const processPORT = Number.isNaN(process.env.PORT) ? Number(process.env.PORT) : undefined;
const PORT = processPORT ?? 5001;
const server = fastify({ logger: LoggerInstance });

const start = async () => {
  registerGlobal(server);
  await MyDataSource.initialize();
  await registerFastifyCookie(server);
  await registerFastifySwagger(server);
  await server.register(cors);
  await server.register(endpointRouter);
  await server.listen({ port: PORT, host: '0.0.0.0' });
};

start();
