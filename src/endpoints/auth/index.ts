import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { refreshTokensController } from './refresh-tokens.controller';
import { signInController } from './sign-in.controller';
import { validateEmailController } from './validate-email.controller';

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.route(refreshTokensController).route(signInController).route(validateEmailController);
};
