import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { checkAccessToken } from '../../shared/hooks';
import { calculateProfitController } from './calculate-profit.controller';
import { coinListController } from './coin-list.controller';
import { coinSearchController } from './coin-search.controller';
import { updateCoinListController } from './update-coin-list.controller';

export const cryptoRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(async (server, options) => {
    server.addHook('preHandler', async (req, reply) => {
      await checkAccessToken(req.headers.authorization);
    });

    server.route(coinListController);
    server.route(coinSearchController);
    server.route(calculateProfitController);
  });

  server.route(updateCoinListController);
};
