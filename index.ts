import fast from 'fastify'
// import { endpointRouter } from './src/endpoints/endpoint.router'
import { test } from './test'
const fastify = fast({ logger: true })

const PORT = 5000 ?? process.env.PORT

const start = async () => {
  try {
    test()
    // fastify.register(endpointRouter)
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
