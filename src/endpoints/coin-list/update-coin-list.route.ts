import { RouteOptions } from 'fastify';
import { IncomingMessage, ServerResponse, Server } from 'http';
import fetch from 'node-fetch';
import { baseUrl, ICoinsMarketsResponse } from '../../shared/coin-gecko';
import { CoinListEntity } from '../../shared/database';
import { statusOutputSuccess } from '../../shared/view-models';

type RouteCustomOptions = RouteOptions<Server, IncomingMessage, ServerResponse, { Body: unknown }>;

export const updateCoinListRoute: RouteCustomOptions = {
  url: '/update',
  method: 'POST',
  handler: async (req, reply) => {
    const res = await fetch(
      `${baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );

    const data: ICoinsMarketsResponse[] = await res.json();

    for (const { id, name, symbol, image, atl_date } of data) {
      await CoinListEntity.create({ coinId: id, name, symbol, image, atl_date }).save();
    }

    return statusOutputSuccess;
  },
};
