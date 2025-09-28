import { z } from 'zod';

export const createVersionBody = z.object({
  simulationId: z.string().cuid(),
  title: z.string().min(1),
  startDate: z.coerce.date(),
  realRate: z.number().min(-0.99).max(1),
  lifeStatus: z.enum(['ALIVE', 'DEAD', 'INVALID']).default('ALIVE'),
});

export type CreateVersionBody = z.infer<typeof createVersionBody>;
