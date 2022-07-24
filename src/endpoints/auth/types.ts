import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export type RouteCustomOptions<TBody> = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: TBody }
>;
