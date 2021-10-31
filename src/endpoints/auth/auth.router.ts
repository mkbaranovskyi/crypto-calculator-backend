import fastify from 'fastify'

export const authRouter = (fastify: any, options: any, done: any) => {
  fastify.post('/auth', (req: any, reply: any) => {
    reply.send({ status: 'OK' })
  })

  done()
}
