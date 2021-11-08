import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
// import { ormCongif } from '../../../ormconfig'

export const registerSignUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (
  server,
  options
) => {
  server.post('/sign-up', async (req, reply) => {
    reply.send({ status: 'OK' })
  })
}
