import { FastifyInstance } from 'fastify';
import fastifySwagger, { SwaggerOptions } from 'fastify-swagger';

export const registerFastifySwagger = (server: FastifyInstance) => {
  server.register<SwaggerOptions>(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    openapi: {
      info: {
        title: 'Crypto Financial Calculator',
        version: '0.0.1',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });
};
