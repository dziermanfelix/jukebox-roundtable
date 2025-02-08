import { jukeboxCreatePath, loginPath, logoutPath } from '../common/paths';
import {
  jukeboxBadCredentialsError,
  jukeboxSuccessfulLogin,
  jukeboxSuccessfulLogout,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getSessionFromWebToken } from '../routes/sessionController';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { makeMockJukebox, makeUrl, serverApp as app, serverRequest as request } from './setup';
import { Role } from '../utils/roles';
import { getJukeboxByName } from '../routes/jukeboxController';

describe('authentication', () => {
  it('jukebox login success', async () => {
    const testJukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(testJukebox.name);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
  });

  it('jukebox login error bad credentials', async () => {
    const testJukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(testJukebox.name);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    testJukebox.code = 'fakepw';
    const response2 = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response2.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response2.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response2.body).toEqual(jukeboxBadCredentialsError(testJukebox.name));
  });

  it('jukebox login no existing web token', async () => {
    const testJukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(testJukebox.name);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    const jukeboxDb = await getJukeboxByName(testJukebox.name);
    expect(session.webToken).toEqual(webToken);
    expect(session.role).toEqual(response.body.role);
    expect(session.queue).toEqual([]);
    expect(session.displayName).toEqual('player1');
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(jukeboxDb.name).toEqual(testJukebox.name);
    expect(jukeboxDb.playedTracks).toEqual([]);
    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
  });

  // it('jukebox login matching web token', async () => {
  //   const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
  //   await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
  //   const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
  //   expect(response1.status).toBe(StatusCodes.OK);
  //   expect(response1.statusCode).toBe(StatusCodes.OK);
  //   expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
  //   const webToken1 = getWebTokenFromResponse(response1);
  //   expect(webToken1).not.toEqual(undefined);
  //   const session1 = await getSessionFromWebToken(webToken1);
  //   expect(session1).not.toBe(null);
  //   const response2 = await request(app).post(makeUrl(loginPath)).set('Cookie', `webToken=${webToken1}`).send(jukebox1);
  //   expect(response2.status).toBe(StatusCodes.OK);
  //   expect(response2.statusCode).toBe(StatusCodes.OK);
  //   expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
  //   const webToken2 = getWebTokenFromResponse(response2);
  //   expect(webToken2).not.toEqual(undefined);
  //   expect(webToken1).toEqual(webToken2);
  //   const session2 = await getSessionFromWebToken(webToken2);
  //   expect(session2).not.toBe(null);
  //   expect(session1).toEqual(session2);
  // });

  // it('jukebox login non matching web token', async () => {
  //   const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
  //   const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '', role: 'starter' };
  //   await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
  //   await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
  //   const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
  //   expect(response1.status).toBe(StatusCodes.OK);
  //   expect(response1.statusCode).toBe(StatusCodes.OK);
  //   expect(response1.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
  //   const webToken1 = getWebTokenFromResponse(response1);
  //   expect(webToken1).not.toEqual(undefined);
  //   const session1 = await getSessionFromWebToken(webToken1);
  //   expect(session1).not.toBe(null);
  //   const response2 = await request(app).post(makeUrl(loginPath)).set('Cookie', `webToken=${webToken1}`).send(jukebox2);
  //   expect(response2.status).toBe(StatusCodes.OK);
  //   expect(response2.statusCode).toBe(StatusCodes.OK);
  //   expect(response2.body).toEqual(jukeboxSuccessfulLogin(jukebox2.name));
  //   const webToken2 = getWebTokenFromResponse(response2);
  //   expect(webToken2).not.toEqual(undefined);
  //   expect(webToken1).not.toEqual(webToken2);
  //   const session2 = await getSessionFromWebToken(webToken2);
  //   expect(session2).not.toBe(null);
  //   expect(session1).not.toEqual(session2);
  // });

  // it('jukebox logout', async () => {
  //   const testJukebox = makeMockJukebox();
  //   await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
  //   const loginResponse = await request(app).post(makeUrl(loginPath)).send(testJukebox);
  //   expect(loginResponse.status).toBe(StatusCodes.OK);
  //   expect(loginResponse.statusCode).toBe(StatusCodes.OK);
  //   expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(testJukebox.name));
  //   const webTokenOriginal = getWebTokenFromResponse(loginResponse);
  //   expect(webTokenOriginal).not.toEqual(undefined);
  //   const session = await getSessionFromWebToken(webTokenOriginal);
  //   expect(session).not.toBe(null);
  //   const logoutResponse = await request(app)
  //     .post(makeUrl(logoutPath))
  //     .set('Cookie', `webToken=${webTokenOriginal}`)
  //     .send({ name: testJukebox.name, sessionId: session._id });
  //   expect(logoutResponse.status).toBe(StatusCodes.OK);
  //   expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
  //   expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(testJukebox.name, session._id));
  //   const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
  //   expect(webTokenAfterLogout).toBe('');
  //   const sessionAfterLogout = await getSessionFromWebToken(webTokenOriginal);
  //   expect(sessionAfterLogout).toBe(null);
  // });
});
