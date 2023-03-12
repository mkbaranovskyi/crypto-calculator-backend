import { RequestGenericInterface, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export type ControllerOptions<TRequestInput extends RequestGenericInterface> = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  TRequestInput
>;
