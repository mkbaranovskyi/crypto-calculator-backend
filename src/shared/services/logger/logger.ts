import { FastifyLoggerInstance } from 'fastify';
import pino from 'pino';

export const LoggerInstance: FastifyLoggerInstance = pino();
