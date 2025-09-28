import { FastifyPluginAsync } from 'fastify';
import { createVersionBody } from './simulations.schema';

const simulationsRoute: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return app.prisma.simulation.findMany({
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
  });

  app.post('/version', async (req, reply) => {
    const data = createVersionBody.parse(req.body);
    const version = await app.prisma.simulationVersion.create({ data });
    return reply.code(201).send(version);
  });
};

export default simulationsRoute;
