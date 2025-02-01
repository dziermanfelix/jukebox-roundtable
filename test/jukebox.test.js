import { jukeboxCreatePath, jukeboxLoginPath, jukeboxPath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';
import { jukeboxExistsError, jukeboxSuccessfulLogin, noToken } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';

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

  it('jukebox get success', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const jukeboxResponse = await request(app)
      .get(`${makeUrl(jukeboxPath)}/${jukebox1.name}`)
      .set('Cookie', `webToken=${webToken}`);
    expect(jukeboxResponse.status).toBe(StatusCodes.OK);
    expect(jukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(jukeboxResponse.body).toMatchObject({ jukebox: { name: jukebox1.name }, sessionId: webToken });
  });

  it('jukebox get error no web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const jukeboxResponse = await request(app).get(`${makeUrl(jukeboxPath)}/${jukebox1.name}`);
    expect(jukeboxResponse.status).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse.error.text).toBe(JSON.stringify(noToken()));
  });
});
