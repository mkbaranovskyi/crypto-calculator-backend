import { FastifyInstance } from 'fastify';

export const globalErrorHandler = (server: FastifyInstance) => {
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    if (Array.isArray(error.validation) && error.validation.length) {
      const validationViewModelErrors: Array<{ constrain: string; message: string }> = new Array();

      for (const validateError of error.validation) {
        validationViewModelErrors.push({ constrain: validateError.keyword, message: validateError.message });
      }

      reply.status(400).send({ errors: validationViewModelErrors });
      return;
    }

    if (error.statusCode) {
      reply.status(error.statusCode).send({ errors: [{ message: error.message }] });
      return;
    }

    reply.status(500).send({ errors: [{ message: 'Internal Server Error' }] });
  });
};
