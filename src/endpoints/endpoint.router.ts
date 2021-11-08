import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import { authRouter } from './auth/auth.router'

export const one = (): string => 'one'

export const endpointRouter: FastifyPluginAsync<FastifyPluginOptions> = async (
  instance,
  options
) => {
  await instance.register(authRouter, { prefix: 'auth' })
}
