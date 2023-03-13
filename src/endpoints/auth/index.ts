import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { refreshTokensController } from './refresh-tokens.controller';
import { signInController } from './sign-in.controller';
import { validateEmailController } from './validate-email.controller';

const { secret } = jwtConfig;

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.route(refreshTokensController).route(signInController).route(validateEmailController);
};
