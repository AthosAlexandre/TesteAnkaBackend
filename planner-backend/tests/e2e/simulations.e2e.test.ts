import request from 'supertest';
import { buildApp } from '../../src/app';

let app: any;
beforeAll(async () => { app = await buildApp(); });
afterAll(async () => { await app.close(); });

test('GET /health', async () => {
  const res = await request(app.server).get('/health');
  expect(res.status).toBe(200);
});
