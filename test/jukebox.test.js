import { jukeboxCreatePath, jukeboxLoginPath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';
import { jukeboxDoesNotExistError, jukeboxExistsError } from '../errors/errorMessages';
import { StatusCodes } from 'http-status-codes';

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

  function makeMockJukebox() {
    const name = 'dust';
    const code = 'dust';
    const spotifyCode = '';
    const role = 'starter';
    return { name: name, code: code, spotifyCode: spotifyCode, role: role };
  }

  function makeUrl(url) {
    return `${apiVersionBaseUrl}${url}`;
  }

  it('jukebox create', async () => {
    const testJukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({ jukebox: { name: testJukebox.name } });
  });

  it('jukebox create error duplicate', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.error.text).toBe(JSON.stringify(jukeboxExistsError(testJukebox.name)));
  });

  it('jukebox login error jukebox does not exist', async () => {
    const nonexistentJukebox = { name: 'nothing', code: 'nothing' };
    const response = await request(app).post(makeUrl(jukeboxLoginPath)).send(nonexistentJukebox);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.error.text).toBe(JSON.stringify(jukeboxDoesNotExistError(nonexistentJukebox.name)));
  });
});
