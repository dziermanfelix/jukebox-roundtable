import { jukeboxCreatePath, loginPath, logoutPath } from '../common/paths';
import { jukeboxBadCredentialsError, jukeboxSuccessfulLogout } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getSessionFromWebToken } from '../routes/sessionController';
import { getWebTokenFromResponse, getWebTokenKey } from '../utils/tokenUtils';
import { makeMockJukebox, makeUrl, serverApp as app, serverRequest as request } from './setup';
import { Role } from '../utils/roles';
import { getJukeboxByName } from '../routes/jukeboxController';

describe('authentication', () => {
  it('jukebox login success', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(jukebox.name);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const session = await getSessionFromWebToken(webToken);
    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('jukebox login side effects', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(jukebox.name);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);

    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);

    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const session = await getSessionFromWebToken(webToken);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('jukebox login error bad credentials', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(jukebox.name);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    jukebox.code = 'fakepw';
    const response2 = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response2.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response2.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response2.body).toEqual(jukeboxBadCredentialsError(jukebox.name));
  });

  it('jukebox login no existing web token', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(jukebox.name);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toEqual(null);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    expect(session.webToken).toEqual(webToken);
    expect(session.role).toEqual(response.body.role);
    expect(session.queue).toEqual([]);
    expect(session.displayName).toEqual('player1');
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(jukeboxDb.name).toEqual(jukebox.name);
    expect(jukeboxDb.playedTracks).toEqual([]);
    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('jukebox login same jukebox', async () => {
    const jukebox = makeMockJukebox();
    const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response1.status).toBe(StatusCodes.OK);
    expect(response1.statusCode).toBe(StatusCodes.OK);
    expect(response1.body.jukebox.name).toEqual(jukebox.name);
    expect(response1.body.jukebox.playedTracks).toEqual([]);
    expect(response1.body.jukebox.queueOrder).toEqual([]);
    expect(response1.body.role).toEqual(Role.STARTER);
    const webToken1 = getWebTokenFromResponse(response1);
    expect(webToken1).not.toEqual(undefined);
    const session1 = await getSessionFromWebToken(webToken1);
    expect(session1).not.toEqual(null);
    const jukeboxDb1 = await getJukeboxByName(jukebox.name);
    expect(session1.webToken).toEqual(webToken1);
    expect(session1.role).toEqual(response1.body.role);
    expect(session1.queue).toEqual([]);
    expect(session1.displayName).toEqual('player1');
    expect(session1.jukebox).toEqual(jukeboxDb1._id);
    expect(jukeboxDb1.name).toEqual(jukebox.name);
    expect(jukeboxDb1.playedTracks).toEqual([]);
    expect(JSON.stringify(jukeboxDb1.queueOrder)).toEqual(JSON.stringify([session1._id]));
    const response2 = await request(app)
      .post(makeUrl(loginPath))
      .set('Cookie', `${getWebTokenKey(response1.body.jukebox.name)}=${webToken1}`)
      .send(jukebox);
    expect(response2.status).toBe(StatusCodes.OK);
    expect(response2.statusCode).toBe(StatusCodes.OK);
    expect(response2.body.jukebox.name).toEqual(jukebox.name);
    expect(response2.body.jukebox.playedTracks).toEqual([]);
    expect(JSON.stringify(response2.body.jukebox.queueOrder)).toEqual(JSON.stringify([session1._id]));
    expect(response2.body.role).toEqual(Role.JOINER);
    const webToken2 = getWebTokenFromResponse(response2);
    expect(webToken2).not.toEqual(undefined);
    expect(webToken1).toEqual(webToken2);
    const session2 = await getSessionFromWebToken(webToken2);
    expect(session2).not.toEqual(null);
    const jukeboxDb2 = await getJukeboxByName(jukebox.name);
    expect(session2.webToken).toEqual(webToken1);
    expect(session2.role).toEqual(response1.body.role);
    expect(session2.queue).toEqual([]);
    expect(session2.displayName).toEqual('player1');
    expect(session2.jukebox).toEqual(jukeboxDb1._id);
    expect(jukeboxDb2.name).toEqual(jukebox.name);
    expect(jukeboxDb2.playedTracks).toEqual([]);
    expect(JSON.stringify(jukeboxDb2.queueOrder)).toEqual(JSON.stringify([session1._id]));
  });

  it('jukebox login different jukebox', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '' };
    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    const response1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    const webToken1 = getWebTokenFromResponse(response1);
    expect(webToken1).not.toEqual(undefined);
    const response2 = await request(app)
      .post(makeUrl(loginPath))
      .set('Cookie', `${getWebTokenKey(jukebox1.name)}=${webToken1}`)
      .send(jukebox2);
    const webToken2 = getWebTokenFromResponse(response2);
    expect(webToken2).not.toEqual(undefined);
    expect(webToken1).not.toEqual(webToken2);

    const session1 = await getSessionFromWebToken(webToken1);
    expect(session1).not.toEqual(null);
    const session2 = await getSessionFromWebToken(webToken2);
    expect(session2).not.toEqual(null);
    const jukeboxDb1 = await getJukeboxByName(jukebox1.name);
    const jukeboxDb2 = await getJukeboxByName(jukebox2.name);

    expect(session1.webToken).toEqual(webToken1);
    expect(session1.jukebox).toEqual(jukeboxDb1._id);
    expect(session1.role).toEqual(response1.body.role);
    expect(session1.displayName).toEqual('player1');
    expect(session1.queue).toEqual([]);
    expect(jukeboxDb1.name).toEqual(jukebox1.name);
    expect(jukeboxDb1.playedTracks).toEqual([]);

    expect(session2.webToken).toEqual(webToken2);
    expect(session2.jukebox).toEqual(jukeboxDb2._id);
    expect(session2.role).toEqual(response2.body.role);
    expect(session2.displayName).toEqual('player1');
    expect(session2.queue).toEqual([]);
    expect(jukeboxDb2.name).toEqual(jukebox2.name);
    expect(jukeboxDb2.playedTracks).toEqual([]);

    expect(JSON.stringify(jukeboxDb1.queueOrder)).toEqual(JSON.stringify([session1._id]));
    expect(JSON.stringify(jukeboxDb2.queueOrder)).toEqual(JSON.stringify([session2._id]));
  });

  it('jukebox logout', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.jukebox.name).toEqual(jukebox.name);
    expect(response.body.jukebox.playedTracks).toEqual([]);
    expect(response.body.jukebox.queueOrder).toEqual([]);
    expect(response.body.role).toEqual(Role.STARTER);
    const webToken = getWebTokenFromResponse(response);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toEqual(null);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    expect(session.webToken).toEqual(webToken);
    expect(session.role).toEqual(response.body.role);
    expect(session.queue).toEqual([]);
    expect(session.displayName).toEqual('player1');
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(jukeboxDb.name).toEqual(jukebox.name);
    expect(jukeboxDb.playedTracks).toEqual([]);
    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `${getWebTokenKey(response.body.jukebox.name)}=${webToken}`)
      .send({ name: jukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));
    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe(undefined);
    const sessionAfterLogout = await getSessionFromWebToken(webToken);
    expect(sessionAfterLogout).toBe(null);
  });
});
