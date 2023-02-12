import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { updateCoinListRoute } from './update-coin-list.route';

export const cryptoRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.route(updateCoinListRoute);
};
