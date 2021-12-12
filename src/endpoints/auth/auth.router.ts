import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { signUpRouter, validateEmailRouter } from './auth.controller';

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(signUpRouter);
  await server.register(validateEmailRouter);
};
