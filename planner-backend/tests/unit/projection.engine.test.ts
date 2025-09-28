import { projectWealth } from '../../src/domain/projection/projection.engine';

test('projeção capitaliza e aplica entradas/saídas', () => {
  const version = {
    id: 'v1',
    startDate: new Date('2025-01-01'),
    realRate: 0.04,
    lifeStatus: 'ALIVE',
    allocations: [
      { kind: 'FINANCIAL', records: [{ value: 10000, at: new Date('2024-12-01') }] },
      { kind: 'REAL_ESTATE', records: [{ value: 200000, at: new Date('2024-12-01') }] }
    ],
    movements: [
      { kind: 'INCOME', amount: 5000, frequency: 'MONTHLY', startDate: new Date('2025-01-01'), endDate: null, nextId: null },
      { kind: 'EXPENSE', amount: 3000, frequency: 'MONTHLY', startDate: new Date('2025-01-01'), endDate: null, nextId: null }
    ],
    insurances: [
      { type: 'LIFE', startDate: new Date('2025-01-01'), months: 12, monthlyPremium: 200, insuredValue: 300000 }
    ]
  } as any;

  const res = projectWealth({ version, untilYear: 2025 });
  expect(res.rows.length).toBe(12);
  expect(res.rows[0].total).toBeGreaterThan(0);
});
