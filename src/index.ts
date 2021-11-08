import fastify from 'fastify';
import dotenv from 'dotenv';
import { endpointRouter } from './endpoints/endpoint.router';
import { connection } from './entity/connection';
import { Users } from './entity/entity';
dotenv.config();

const PORT = process.env.PORT ?? 5000;
const server = fastify({ logger: true });

const start = async () => {
  server.register(endpointRouter);
  server.listen(PORT, async (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    console.log(`The server started on the PORT ${PORT}!`);
  });
};

const connectToDB = async () => {
  try {
    const connect = await connection();
    const user = await connect.manager.insert(Users, {
      email: 'corlack@gmail.com',
      passwordHash: 'privet',
      sessionKey: 'date',
    });
    start();
  } catch (err) {
    console.error(err);
  }
};
connectToDB();
