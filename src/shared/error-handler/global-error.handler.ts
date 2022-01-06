import { FastifyInstance } from 'fastify';

export const globalErrorHandler = (server: FastifyInstance) => {
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    reply.status(500).send({ error: { message: 'Internal Server Error' } });
  });
};
