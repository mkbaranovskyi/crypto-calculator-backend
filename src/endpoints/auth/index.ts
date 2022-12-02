import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { checkAccessToken } from '../../shared/hooks';
import { codeEmailRoute } from './code-email.route';
import { forgotEmailRoute } from './forgot-email.route';
import { newPasswordRoute } from './new-password.route';
import { signInRoute } from './sign-in.route';
import { signUpRoute } from './sign-up.route';
import { validateEmailRoute } from './validate-email.route';

const { secret } = jwtConfig;

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(async (server, options) => {
    server.addHook('preHandler', async (req, reply) => {
      await checkAccessToken(secret, req.headers.authorization);
    });

    server.route(validateEmailRoute);
  });

  server
    .route(signUpRoute)
    .route(forgotEmailRoute)
    .route(codeEmailRoute)
    .route(newPasswordRoute)
    .route(signInRoute);
};
