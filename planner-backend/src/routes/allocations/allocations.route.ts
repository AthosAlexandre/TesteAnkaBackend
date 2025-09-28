import { FastifyPluginAsync } from 'fastify';

const allocationsRoute: FastifyPluginAsync = async (app) => {

  app.get('/', async () => {
    return app.prisma.allocation.findMany({
      include: { records: true },
    });
  });

  app.post('/', async (req, reply) => {
    const body = req.body as any;
    const created = await app.prisma.allocation.create({
      data: {
        versionId: body.versionId,
        kind: body.kind,
        name: body.name,
        hasFinancing: !!body.hasFinancing,
        financingStart: body.financingStart ? new Date(body.financingStart) : null,
        financingMonths: body.financingMonths ?? null,
        financingMonthlyRate: body.financingMonthlyRate ?? null,
        downPayment: body.downPayment ?? null,
      },
    });
    return reply.code(201).send(created);
  });


  app.post('/:allocationId/records', async (req, reply) => {
    const { allocationId } = req.params as { allocationId: string };
    const body = req.body as any;
    const created = await app.prisma.allocationRecord.create({
      data: {
        allocationId,
        value: Number(body.value),
        at: new Date(body.at),
      },
    });
    return reply.code(201).send(created);
  });
};

export default allocationsRoute;
