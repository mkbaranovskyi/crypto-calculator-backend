import fast from 'fastify'
// import { endpointRouter } from './src/endpoints/endpoint.router'
import { one } from './one.js'
console.log(one())
// const fastify = fast({ logger: true })

// const PORT = 5000 ?? process.env.PORT

// const start = async () => {
//   try {
//     one()
//     // fastify.register(endpointRouter)
//     await fastify.listen(PORT, (err) => {
//       console.log('ku')
//     })
//   } catch (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
// }
// start()
