import { jukeboxCreatePath, loginPath, logoutPath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import {
  jukeboxBadCredentialsError,
  jukeboxDoesNotExistError,
  jukeboxSuccessfulLogin,
  jukeboxSuccessfulLogout,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getSessionFromWebToken } from '../routes/sessionController';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { makeMockJukebox, makeUrl } from './setup';

describe('jukebox', () => {
  it('jukebox login error jukebox does not exist', async () => {
    const nonexistentJukebox = { name: 'nothing', code: 'nothing' };
    const response = await request(app).post(makeUrl(loginPath)).send(nonexistentJukebox);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.error.text).toEqual(JSON.stringify(jukeboxDoesNotExistError(nonexistentJukebox.name)));
  });

  it('jukebox login error bad credentials', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    testJukebox.code = 'fakepw';
    const response = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toEqual(jukeboxBadCredentialsError(testJukebox.name));
  });

  it('jukebox login success', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const response = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
  });

  it('jukebox login with no existing web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(response1);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
  });

  it('jukebox login valid web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken1 = getWebTokenFromResponse(response1);
    expect(webToken1).not.toEqual(undefined);
    const session1 = await getSessionFromWebToken(webToken1);
    expect(session1).not.toBe(null);
    const response2 = await request(app)
      .post(makeUrl(loginPath))
      .set('Cookie', `webToken=${webToken1}`)
      .send(jukebox1);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken2 = getWebTokenFromResponse(response2);
    expect(webToken2).not.toEqual(undefined);
    expect(webToken1).toEqual(webToken2);
    const session2 = await getSessionFromWebToken(webToken2);
    expect(session2).not.toBe(null);
    expect(session1).toEqual(session2);
  });

  it('jukebox login invalid web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken1 = getWebTokenFromResponse(response1);
    expect(webToken1).not.toEqual(undefined);
    const session1 = await getSessionFromWebToken(webToken1);
    expect(session1).not.toBe(null);
    const response2 = await request(app)
      .post(makeUrl(loginPath))
      .set('Cookie', `webToken=${webToken1}`)
      .send(jukebox2);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox2.name));
    const webToken2 = getWebTokenFromResponse(response2);
    expect(webToken2).not.toEqual(undefined);
    expect(webToken1).not.toEqual(webToken2);
    const session2 = await getSessionFromWebToken(webToken2);
    expect(session2).not.toBe(null);
    expect(session1).not.toEqual(session2);
  });

  it('jukebox logout', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
    const webTokenOriginal = getWebTokenFromResponse(loginResponse);
    expect(webTokenOriginal).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webTokenOriginal);
    expect(session).not.toBe(null);
    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `webToken=${webTokenOriginal}`)
      .send({ name: testJukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(testJukebox.name, session._id));
    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe('');
    const sessionAfterLogout = await getSessionFromWebToken(webTokenOriginal);
    expect(sessionAfterLogout).toBe(null);
  });
});
