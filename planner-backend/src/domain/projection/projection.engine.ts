import { addMonths, differenceInMonths } from 'date-fns';
import { ProjectionInput } from './projection.types.js';

export function projectWealth(input: ProjectionInput) {
  const { version, untilYear } = input;
  const start = new Date(version.startDate);
  const end = new Date(`${untilYear}-12-31`);
  const months = Math.max(0, differenceInMonths(end, start) + 1);

  let financial = startingFinancial(version);
  let realEstate = startingRealEstate(version);
  const rows: Array<{ date: Date; financial: number; realEstate: number; total: number; totalWithoutInsurances: number }> = [];

  const monthlyRealRate = Math.pow(1 + version.realRate, 1/12) - 1;

  let date = new Date(start);
  for (let i=0; i<months; i++) {

    const incomes = sumMovements(version, date, 'INCOME');
    let expenses = sumMovements(version, date, 'EXPENSE');

    if (version.lifeStatus === 'DEAD') {
     
      expenses = expenses / 2;
      incomes = 0;
    } else if (version.lifeStatus === 'INVALID') {
      incomes = 0;
    }
    const premiums = sumPremiums(version, date);

    financial = (financial + incomes - expenses - premiums) * (1 + monthlyRealRate);

    realEstate = realEstate * (1 + monthlyRealRate);

    const total = financial + realEstate;
    const totalWithoutIns = (financial + premiums) + realEstate; 

    rows.push({ date: new Date(date), financial, realEstate, total, totalWithoutInsurances: totalWithoutIns });
    date = addMonths(date, 1);
  }

  return {
    meta: { versionId: version.id, start, untilYear },
    rows
  };
}

function pickLatestBefore(records: { value: number; at: Date }[], start: Date) {
  return records
    .filter(r => r.at.getTime() <= start.getTime())
    .sort((a,b) => b.at.getTime() - a.at.getTime())[0];
}

function startingFinancial(version: ProjectionInput['version']) {
  let v = 0;
  for (const a of version.allocations.filter(a => a.kind === 'FINANCIAL')) {
    const last = pickLatestBefore(a.records, new Date(version.startDate));
    if (last) v += last.value;
  }
  return v;
}

function startingRealEstate(version: ProjectionInput['version']) {
  let v = 0;
  for (const a of version.allocations.filter(a => a.kind === 'REAL_ESTATE')) {
    const last = pickLatestBefore(a.records, new Date(version.startDate));
    if (last) v += last.value;
  }
  return v;
}

function sumMovements(version: ProjectionInput['version'], when: Date, kind: 'INCOME'|'EXPENSE') {
  let s = 0;
  for (const m of version.movements.filter(m => m.kind === kind)) {
    if (isActive(m, when)) {
      if (m.frequency === 'ONCE') s += m.amount;
      if (m.frequency === 'MONTHLY') s += m.amount;
      if (m.frequency === 'YEARLY') {
        if (when.getMonth() === new Date(m.startDate).getMonth()) s += m.amount;
      }
    }
  }
  return s;
}

function sumPremiums(version: ProjectionInput['version'], when: Date) {
  let s = 0;
  for (const ins of version.insurances) {
    const start = new Date(ins.startDate);
    const end = addMonths(start, ins.months);
    if (when >= start && when < end) s += ins.monthlyPremium;
  }
  return s;
}

function isActive(m: { startDate: Date; endDate: Date | null }, when: Date) {
  return when >= new Date(m.startDate) && (!m.endDate || when <= new Date(m.endDate));
}
