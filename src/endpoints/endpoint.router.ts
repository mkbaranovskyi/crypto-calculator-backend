import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { initAsyncLocalStorage } from '../shared/services/async-local-storage';
import { authRouter } from './auth';
import { cryptoRouter } from './crypto';

export const endpointRouter: FastifyPluginAsync<FastifyPluginOptions> = async (instance) => {
  instance.addHook('preHandler', (req, reply, done) => {
    initAsyncLocalStorage(done);
  });

  await instance.register(authRouter, { prefix: 'auth' });
  await instance.register(cryptoRouter, { prefix: 'crypto' });
};
