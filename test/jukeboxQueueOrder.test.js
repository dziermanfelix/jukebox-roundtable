import { getOrderPath, jukeboxCreatePath, loginPath, logoutPath, setOrderPath } from '../common/paths';
import { jukeboxSuccessfulLogout } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeMockJukebox, makeUrl } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { getOrderDb } from '../routes/queueOrderController';
import { serverApp as app } from './setup';
import { serverRequest as request } from './setup';
import { Role } from '../utils/roles';

describe('queue order', () => {
  it('login check queue order', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);

    const jukeboxBeforeLoginDb = await getJukeboxByName(jukebox.name);
    expect(JSON.stringify(jukeboxBeforeLoginDb.queueOrder)).toEqual(JSON.stringify([]));
    const sessionOrderDbBefore = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbBefore)).toEqual(JSON.stringify([]));
    const getOrderResponseBefore = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseBefore.status).toBe(StatusCodes.OK);
    expect(getOrderResponseBefore.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseBefore.body)).toEqual(JSON.stringify({ sessions: [] }));

    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.JOINER);

    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('joiner');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const sessionOrderDbAfter = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbAfter)).toEqual(JSON.stringify([session._id]));
    const getOrderResponseAfter = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseAfter.status).toBe(StatusCodes.OK);
    expect(getOrderResponseAfter.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseAfter.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
  });

  it('logout check queue order', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);

    const jukeboxBeforeLoginDb = await getJukeboxByName(jukebox.name);
    expect(JSON.stringify(jukeboxBeforeLoginDb.queueOrder)).toEqual(JSON.stringify([]));
    const sessionOrderDbBefore = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbBefore)).toEqual(JSON.stringify([]));
    const getOrderResponseBefore = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseBefore.status).toBe(StatusCodes.OK);
    expect(getOrderResponseBefore.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseBefore.body)).toEqual(JSON.stringify({ sessions: [] }));

    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.JOINER);

    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('joiner');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const sessionOrderDbAfter = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbAfter)).toEqual(JSON.stringify([session._id]));
    const getOrderResponseAfter = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseAfter.status).toBe(StatusCodes.OK);
    expect(getOrderResponseAfter.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseAfter.body)).toEqual(JSON.stringify({ sessions: [session._id] }));

    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `webToken=${webToken}`)
      .send({ name: jukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));

    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe(undefined);
    const sessionAfterLogout = await getSessionFromWebToken(webToken);
    expect(sessionAfterLogout).toBe(null);

    const jukeboxDbAfterLogout = await getJukeboxByName(jukebox.name);

    expect(JSON.stringify(jukeboxDbAfterLogout.queueOrder)).toEqual(JSON.stringify([]));
    const sessionOrderDbAfterLogout = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbAfterLogout)).toEqual(JSON.stringify([]));
    const getOrderResponseAfterLogout = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseAfterLogout.status).toBe(StatusCodes.OK);
    expect(getOrderResponseAfterLogout.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseAfterLogout.body)).toEqual(JSON.stringify({ sessions: [] }));
  });

  it('queue order set and get order', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);

    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.JOINER);

    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('joiner');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const sessionOrderDbAfterLogout = await getOrderDb(jukebox.name);
    expect(JSON.stringify(sessionOrderDbAfterLogout)).toEqual(JSON.stringify([session._id]));
    const getOrderResponseAfterLogout = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponseAfterLogout.status).toBe(StatusCodes.OK);
    expect(getOrderResponseAfterLogout.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponseAfterLogout.body)).toEqual(JSON.stringify({ sessions: [session._id] }));

    const setOrderResponse = await request(app)
      .post(makeUrl(`${setOrderPath}${jukeboxDb.name}`))
      .send({ order: [session] });
    expect(setOrderResponse.status).toBe(StatusCodes.OK);
    expect(setOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(setOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
    const getOrderAfterSetResponse = await request(app).get(makeUrl(`${getOrderPath}${jukeboxDb.name}`));
    expect(getOrderAfterSetResponse.status).toBe(StatusCodes.OK);
    expect(getOrderAfterSetResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderAfterSetResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
  });

  it('queue order reorder', async () => {
    const jukebox = makeMockJukebox();
    const expectedSessions = [];
    for (let i = 0; i < 10; i++) {
      const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.jukebox.name).toEqual(jukebox.name);
      expect(response.body.jukebox.playedTracks).toEqual([]);
      const webToken = getWebTokenFromResponse(response);
      expect(webToken).not.toEqual(undefined);
      let jukeboxDb = await getJukeboxByName(jukebox.name);
      let session = await getSessionFromWebToken(webToken);
      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      expect(session.jukebox).toEqual(jukeboxDb._id);
      expect(session.queue).toEqual([]);
      expectedSessions.push(session._id);
    }
    for (let i = 0; i < 10; i++) {
      const shuffledSessions = expectedSessions.sort(() => Math.random() - 0.5);
      const setSessionOrderResponse = await request(app)
        .post(makeUrl(`${setOrderPath}${jukebox.name}`))
        .send({ order: shuffledSessions });
      expect(setSessionOrderResponse.status).toBe(StatusCodes.OK);
      expect(setSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
      expect(JSON.stringify(setSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: shuffledSessions }));
      const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
      expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
      expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
      expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: shuffledSessions }));
    }
  });

  it('queue order login single', async () => {
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

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const sessionOrderFromDb = await getOrderDb(jukeboxDb.name);
    expect(JSON.stringify(sessionOrderFromDb)).toEqual(JSON.stringify([session._id]));
    const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
    expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
  });

  it('queue order login multiple', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let expectedSessions = [];
    const numSessions = 10;
    for (let i = 0; i < numSessions; i++) {
      const response = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.jukebox.name).toEqual(jukebox.name);
      expect(response.body.jukebox.playedTracks).toEqual([]);

      const webToken = getWebTokenFromResponse(response);
      expect(webToken).not.toEqual(undefined);

      const jukeboxDb = await getJukeboxByName(jukebox.name);
      const session = await getSessionFromWebToken(webToken);

      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      expect(session.jukebox).toEqual(jukeboxDb._id);
      expect(session.displayName).toEqual('player1');
      expect(session.queue).toEqual([]);

      expectedSessions.push(session._id);

      expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify(expectedSessions));
      const sessionOrderFromDb = await getOrderDb(jukeboxDb.name);
      expect(JSON.stringify(sessionOrderFromDb)).toEqual(JSON.stringify(expectedSessions));
      const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
      expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
      expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
      expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: expectedSessions }));
    }
    // after all, check queue order again
    const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
    expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: expectedSessions }));
  });

  it('queue order logout', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);

    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const session = await getSessionFromWebToken(webToken);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));
    const sessionOrderFromDb = await getOrderDb(jukeboxDb.name);
    expect(JSON.stringify(sessionOrderFromDb)).toEqual(JSON.stringify([session._id]));
    const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
    expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));

    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `webToken=${webToken}`)
      .send({ name: jukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));

    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe(undefined);
    const sessionAfterLogout = await getSessionFromWebToken(webToken);
    expect(sessionAfterLogout).toBe(null);

    const jukeboxAfterLogout = await getJukeboxByName(jukebox.name);
    expect(JSON.stringify(jukeboxAfterLogout.queueOrder)).toEqual(JSON.stringify([]));
    const orderFromDbAfterLogout = await getOrderDb(jukeboxAfterLogout.name);
    expect(JSON.stringify(orderFromDbAfterLogout)).toEqual(JSON.stringify([]));
    const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponse.status).toBe(StatusCodes.OK);
    expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponse.body)).toEqual(JSON.stringify({ sessions: [] }));
  });

  it('queue order logout multiple', async () => {
    const numSessions = 10;
    const jukebox = makeMockJukebox();
    let sessionIds = [];
    let webTokens = [];
    let expectedSessions = [];
    for (let i = 0; i < numSessions; i++) {
      const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
      expect(loginResponse.body.jukebox.playedTracks).toEqual([]);

      const webToken = getWebTokenFromResponse(loginResponse);
      expect(webToken).not.toEqual(undefined);

      const jukeboxDb = await getJukeboxByName(jukebox.name);
      const session = await getSessionFromWebToken(webToken);

      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      expect(session.jukebox).toEqual(jukeboxDb._id);
      expect(session.displayName).toEqual('player1');
      expect(session.queue).toEqual([]);

      expectedSessions.push(session._id);
      webTokens.push(webToken);
      sessionIds.push(session._id);

      expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify(expectedSessions));
      const sessionOrderFromDb = await getOrderDb(jukeboxDb.name);
      expect(JSON.stringify(sessionOrderFromDb)).toEqual(JSON.stringify(expectedSessions));
      const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
      expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
      expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
      expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: expectedSessions }));
    }
    for (let i = 0; i < numSessions; i++) {
      const sessionId = sessionIds.at(i);
      const webToken = webTokens.at(i);
      expectedSessions.shift();
      const logoutResponse = await request(app)
        .post(makeUrl(logoutPath))
        .set('Cookie', `webToken=${webToken}`)
        .send({ name: jukebox.name, sessionId: sessionId });
      expect(logoutResponse.status).toBe(StatusCodes.OK);
      expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
      expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, sessionId));

      const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
      expect(webTokenAfterLogout).toBe(undefined);
      const jukeboxDbAfterLogout = await getJukeboxByName(jukebox.name);
      const sessionAfterLogout = await getSessionFromWebToken(webToken);
      expect(sessionAfterLogout).toBe(null);

      expect(JSON.stringify(jukeboxDbAfterLogout.queueOrder)).toEqual(JSON.stringify(expectedSessions));
      const sessionOrderFromDb = await getOrderDb(jukeboxDbAfterLogout.name);
      expect(JSON.stringify(sessionOrderFromDb)).toEqual(JSON.stringify(expectedSessions));
      const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
      expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
      expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
      expect(JSON.stringify(getSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: expectedSessions }));
    }
  });
});
