import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { checkAccessToken } from '../../shared/hooks';
import { codeEmailController } from './code-email.controller';
import { forgotEmailController } from './forgot-email.controller';
import { newPasswordController } from './new-password.controller';
import { refreshTokensController } from './refresh-tokens.controller';
import { signInController } from './sign-in.controller';
import { signUpController } from './sign-up.controller';
import { validateEmailController } from './validate-email.controller';

const { secret } = jwtConfig;

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(async (server, options) => {
    server.addHook('preHandler', async (req, reply) => {
      await checkAccessToken(secret, req.headers.authorization);
    });

    server.route(validateEmailController);
  });

  server
    .route(refreshTokensController)
    .route(signUpController)
    .route(forgotEmailController)
    .route(codeEmailController)
    .route(newPasswordController)
    .route(signInController);
};
