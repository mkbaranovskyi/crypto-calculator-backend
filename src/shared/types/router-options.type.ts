import { RequestGenericInterface, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export type RouteCustomOptions<TRequestInput extends RequestGenericInterface> = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  TRequestInput
>;
