import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { updateCoinListRoute } from './update-coin-list.route';

export const coinListRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.route(updateCoinListRoute);
};
