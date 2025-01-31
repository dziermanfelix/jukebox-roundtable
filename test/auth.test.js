import { jukeboxCreatePath, jukeboxLoginPath, jukeboxLogoutPath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';
import {
  jukeboxBadCredentialsError,
  jukeboxDoesNotExistError,
  jukeboxSuccessfulLogin,
  jukeboxSuccessfulLogout,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { parse } from 'set-cookie-parser';
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

  function getWebTokenCookie(response) {
    const cookies = parse(response);
    const webToken = cookies.find((cookie) => cookie.name === 'webToken');
    return webToken.value;
  }

  it('jukebox login error jukebox does not exist', async () => {
    const nonexistentJukebox = { name: 'nothing', code: 'nothing' };
    const response = await request(app).post(makeUrl(jukeboxLoginPath)).send(nonexistentJukebox);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.error.text).toEqual(JSON.stringify(jukeboxDoesNotExistError(nonexistentJukebox.name)));
  });

  it('jukebox login error bad credentials', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    testJukebox.code = 'fakepw';
    const response = await request(app).post(makeUrl(jukeboxLoginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toEqual(jukeboxBadCredentialsError(testJukebox.name));
  });

  it('jukebox successful login', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const response = await request(app).post(makeUrl(jukeboxLoginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
    const webToken = getWebTokenCookie(response);
    expect(webToken).not.toEqual(undefined);
  });

  it('jukebox login to two different jukeboxes, receive two different web tokens, no cookies', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    const response1 = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken1 = getWebTokenCookie(response1);
    const response2 = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox2);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox2.name));
    const webToken2 = getWebTokenCookie(response2);
    expect(webToken1).not.toEqual(webToken2);
  });

  it('jukebox login, same jukebox, cookies', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const response1 = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken1 = getWebTokenCookie(response1);
    const response2 = await request(app)
      .post(makeUrl(jukeboxLoginPath))
      .set('Cookie', `webToken=${webToken1}`)
      .send(jukebox1);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken2 = getWebTokenCookie(response2);
    expect(webToken1).toEqual(webToken2);
  });

  it('jukebox login, different jukebox, cookies', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    const response1 = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken1 = getWebTokenCookie(response1);
    const response2 = await request(app)
      .post(makeUrl(jukeboxLoginPath))
      .set('Cookie', `webToken=${webToken1}`)
      .send(jukebox2);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox2.name));
    const webToken2 = getWebTokenCookie(response2);
    expect(webToken1).not.toEqual(webToken2);
  });

  it('jukebox logout', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(testJukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
    const webTokenOriginal = getWebTokenCookie(loginResponse);
    const session = await getSessionFromWebToken(webTokenOriginal);
    expect(session).not.toBe(null);
    const logoutResponse = await request(app)
      .post(makeUrl(jukeboxLogoutPath))
      .set('Cookie', `webToken=${webTokenOriginal}`)
      .send({ name: testJukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(testJukebox.name, session._id));
    const webTokenAfterLogout = getWebTokenCookie(logoutResponse);
    expect(webTokenAfterLogout).toBe('');
    const sessionAfterLogout = await getSessionFromWebToken(webTokenOriginal);
    expect(sessionAfterLogout).toBe(null);
  });
});
