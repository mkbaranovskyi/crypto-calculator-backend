import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import { UserEntity } from '../../shared/database'

export const signUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (
  server,
  options
) => {
  server.post('/sign-up', async (req, reply) => {
    const user = UserEntity.create({
      email: 'max@bar.com',
      passwordHash: 'fasdewrgjkz',
      sessionKey: '234534sdfg342'
    })

    await user.save()
    const users = await UserEntity.find({})
    console.log(users)
    
    reply.send({ status: 'ok!' })
  })
}
