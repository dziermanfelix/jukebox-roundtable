import { jukeboxCreatePath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';

describe('jukebox', () => {
  async function truncateDb() {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }

  beforeAll(async () => {
    await mongoose.connect(mongoUrl);
  });

  beforeEach(async () => {
    await truncateDb();
  });

  afterAll(async () => {
    await truncateDb();
    await mongoose.connection.close();
  });

  async function makeMockJukebox() {
    const name = 'dust';
    const code = 'dust';
    const spotifyCode = '';
    const role = 'starter';
    return { name: name, code: code, spotifyCode: spotifyCode, role: role };
  }

  it('create jukebox', async () => {
    const testJukebox = await makeMockJukebox();
    const response = await request(app).post(`${apiVersionBaseUrl}${jukeboxCreatePath}`).send(testJukebox);
    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ jukebox: { name: testJukebox.name } });
  });

  it('create jukebox error duplicate', async () => {
    const testJukebox = await makeMockJukebox();
    await request(app).post(`${apiVersionBaseUrl}${jukeboxCreatePath}`).send(testJukebox);
    const response = await request(app).post(`${apiVersionBaseUrl}${jukeboxCreatePath}`).send(testJukebox);
    expect(response.status).toBe(400);
    expect(response.statusCode).toBe(400);
    expect(response.error.text).toBe(JSON.stringify({ msg: 'jukebox dust is being used' }));
  });
});
