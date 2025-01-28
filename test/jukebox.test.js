import { jukeboxCreatePath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';
import listRoutes from 'express-list-routes';

describe('jukebox', () => {
  async function truncateDb() {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }

  beforeAll(async () => {
    const routes = listRoutes(app);
    console.log(routes);
    await mongoose.connect(mongoUrl);
    await truncateDb();
  });

  afterAll(async () => {
    await truncateDb();
    await mongoose.connection.close();
  });

  it('create duplicate jukebox error', async () => {
    let testJukebox = { name: 'dust', code: 'dust', spotifyCode: 'pizza', role: 'starter' };
    await request(app).post(`${apiVersionBaseUrl}${jukeboxCreatePath}`).send(testJukebox);
    const response = await request(app).post(`${apiVersionBaseUrl}${jukeboxCreatePath}`).send(testJukebox);
    expect(response.status).toBe(400);
    expect(response.statusCode).toBe(400);
    expect(response.error.text).toBe(JSON.stringify({ msg: 'jukebox dust is being used' }));
  });
});
