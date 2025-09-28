import { SimulationVersion, LifeStatus } from '@prisma/client';

export type ProjectionInput = {
  version: SimulationVersion & {
    allocations: { records: { value: number; at: Date }[] }[];
    movements: { kind: 'INCOME' | 'EXPENSE'; amount: number; frequency: 'ONCE'|'MONTHLY'|'YEARLY'; startDate: Date; endDate: Date | null; nextId: string | null }[];
    insurances: { type: 'LIFE' | 'DISABILITY'; startDate: Date; months: number; monthlyPremium: number; insuredValue: number }[];
  };
  untilYear: number; // ex: 2060
};
