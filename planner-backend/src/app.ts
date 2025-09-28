import Fastify from 'fastify';
import swagger from './plugins/swagger';
import prisma from './plugins/prisma';
import health from './routes/health.route';
import simulationsRoute from './routes/simulations/simulations.route';
import allocationsRoute from './routes/allocations/allocations.route';
import movementsRoute from './routes/movements/movements.route';
import insurancesRoute from './routes/insurances/insurances.route';

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(swagger);
  await app.register(prisma);

  app.register(health, { prefix: '/health' });
  app.register(simulationsRoute, { prefix: '/simulations' });
  app.register(allocationsRoute, { prefix: '/allocations' });
  app.register(movementsRoute, { prefix: '/movements' });
  app.register(insurancesRoute, { prefix: '/insurances' });

  return app;
}
