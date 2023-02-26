import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { checkAccessToken } from '../../shared/hooks';
import { calculateProfitRoute } from './calculate-profit.route';
import { coinListRoute } from './coin-list.route';
import { coinSearchRoute } from './coin-search.route';
import { updateCoinListRoute } from './update-coin-list.route';

const { secret } = jwtConfig;

export const cryptoRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(async (server, options) => {
    server.addHook('preHandler', async (req, reply) => {
      await checkAccessToken(secret, req.headers.authorization);
    });

    server.route(coinListRoute);
    server.route(coinSearchRoute);
    server.route(calculateProfitRoute);
  });

  server.route(updateCoinListRoute);
};
