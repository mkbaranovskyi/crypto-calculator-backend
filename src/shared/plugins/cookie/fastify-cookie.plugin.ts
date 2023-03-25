import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { cookieConfig, jwtConfig } from '../../configs';

const date = DateTime.utc();
const expires = date.plus({ seconds: jwtConfig.refreshDeathDate }).toJSDate();

export const registerFastifyCookie = async (server: FastifyInstance) => {
  await server.register(cookie, {
    secret: cookieConfig.secret,
    hook: 'preHandler',
    parseOptions: {
      expires,
    },
  } as FastifyCookieOptions);
};
