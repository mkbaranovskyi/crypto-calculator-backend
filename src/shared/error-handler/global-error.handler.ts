import { FastifyInstance } from 'fastify';

interface IValidationViewModelError {
  constrain: string;
  message: string;
}

export const registerGlobal = (server: FastifyInstance) => {
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    if (Array.isArray(error.validation) && error.validation.length) {
      const validationViewModelErrors: Array<IValidationViewModelError> = [];

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
