import { jukeboxCreatePath, jukeboxLoginPath } from '../common/paths';
import { apiVersionBaseUrl } from '../common/api';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { mongoUrl } from '../utils/environmentVariables';
import {
  jukeboxBadCredentialsError,
  jukeboxDoesNotExistError,
  jukeboxExistsError,
  jukeboxSuccessfulLogin,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { parse } from 'set-cookie-parser';

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
    const webToken = getWebTokenCookie(response);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
  });

  it('jukebox two different logins, two different web tokens', async () => {
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

  // add test for when user already has webtoken
  
});
