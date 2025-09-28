import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({ ok: true }));
};

export default health;
