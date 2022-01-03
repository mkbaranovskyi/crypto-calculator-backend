import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { checkAccessToken } from '../../shared/hooks';
import { forgotEmailRouter, signUpRouter, validateEmailRouter } from './auth.controller';

const { secret } = jwtConfig;

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(signUpRouter);

  await server.register(async (server, options) => {
    server.addHook('preHandler', async (req, reply) => {
      await checkAccessToken(secret, req.headers.authorization);
    });
    await server.register(validateEmailRouter);
  });

  await server.register(forgotEmailRouter);
};
