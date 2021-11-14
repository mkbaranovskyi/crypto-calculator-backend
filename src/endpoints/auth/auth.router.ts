import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import { signUpRouter } from './auth.controller'

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(signUpRouter)
}
