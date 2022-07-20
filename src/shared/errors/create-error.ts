import createError from '@fastify/error';

export const BadRequestException = createError('ERROR_CODE', '%s', 400);
export const UnauthorizedException = createError('ERROR_CODE', '%s', 401);

export const InternalServerError = createError('ERROR_CODE', '%s', 500);
export const BadGatewayException = createError('ERROR_CODE', '%s', 502);
