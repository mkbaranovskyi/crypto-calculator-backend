import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import { registerSignUpRouter } from './auth.controller'

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  await server.register(registerSignUpRouter)
}
