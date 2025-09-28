import { FastifyPluginAsync } from 'fastify';

const insurancesRoute: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return app.prisma.insurance.findMany();
  });

  app.post('/', async (req, reply) => {
    const body = req.body as any;
    const created = await app.prisma.insurance.create({
      data: {
        versionId: body.versionId,
        type: body.type,
        name: body.name,
        startDate: new Date(body.startDate),
        months: Number(body.months),
        monthlyPremium: Number(body.monthlyPremium),
        insuredValue: Number(body.insuredValue),
      },
    });
    return reply.code(201).send(created);
  });

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const updated = await app.prisma.insurance.update({
      where: { id },
      data: {
        type: body.type,
        name: body.name,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        months: body.months !== undefined ? Number(body.months) : undefined,
        monthlyPremium: body.monthlyPremium !== undefined ? Number(body.monthlyPremium) : undefined,
        insuredValue: body.insuredValue !== undefined ? Number(body.insuredValue) : undefined,
      },
    });
    return reply.send(updated);
  });
};

export default insurancesRoute;
