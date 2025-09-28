import { FastifyPluginAsync } from 'fastify';

const movementsRoute: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return app.prisma.movement.findMany();
  });

  app.post('/', async (req, reply) => {
    const body = req.body as any;
    const created = await app.prisma.movement.create({
      data: {
        versionId: body.versionId,
        kind: body.kind,
        amount: Number(body.amount),
        frequency: body.frequency,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        nextId: body.nextId ?? null,
      },
    });
    return reply.code(201).send(created);
  });

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const updated = await app.prisma.movement.update({
      where: { id },
      data: {
        kind: body.kind,
        amount: body.amount !== undefined ? Number(body.amount) : undefined,
        frequency: body.frequency,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        nextId: body.nextId,
      },
    });
    return reply.send(updated);
  });
};

export default movementsRoute;
