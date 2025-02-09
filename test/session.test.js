import { jukeboxCreatePath, loginPath, jukeboxPrivatePath, setQueuePath, getQueuePath } from '../common/paths';
import { deleteJukeboxSuccess } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { createSession, getSessionFromWebToken } from '../routes/sessionController';
import { makeMockJukebox, makeUrl, multiTrackQueue1, multiTrackQueue1Reordered, oneTrackQueue } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { getOrderDb } from '../routes/queueOrderController';
import { serverApp as app } from './setup';
import { serverRequest as request } from './setup';
import { Role } from '../utils/roles';

describe('session', () => {
  it('session login check contents', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
  });

  it('create duplicate session attempt', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
    expect(JSON.stringify(jukeboxDb.queueOrder)).toEqual(JSON.stringify([session._id]));

    const createSessionAttempt = await createSession(jukeboxDb, webToken1, session.role);
    expect(createSessionAttempt).toBe(null);
  });

  it('delete jukebox cleanup many sessions', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({ jukebox: { name: jukebox.name } });
    const webTokens = [];
    const sessions = [];
    const numSessions = 10;
    for (let count = 0; count < numSessions; count++) {
      const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
      expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
      expect(loginResponse.body.role).toEqual(Role.JOINER);
      const webToken = getWebTokenFromResponse(loginResponse);
      expect(webToken).not.toEqual(undefined);
      webTokens.push(webToken);
      let session = await getSessionFromWebToken(webToken);
      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      sessions.push(session);
    }

    const deleteJukeboxResponse = await request(app)
      .delete(`${makeUrl(jukeboxPrivatePath)}/${jukebox.name}`)
      .set('Cookie', `webToken=${webTokens[0]}`);
    expect(deleteJukeboxResponse.status).toBe(StatusCodes.OK);
    expect(deleteJukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(deleteJukeboxResponse.body)).toBe(JSON.stringify(deleteJukeboxSuccess(jukebox.name)));

    for (const webToken of webTokens) {
      const sessionAfterDelete = await getSessionFromWebToken(webToken);
      expect(sessionAfterDelete).toBe(null);
    }

    const jukeboxDb = await getJukeboxByName(jukebox.name);
    expect(jukeboxDb).toEqual(null);
  });

  it('session get empty queue', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: [] });
  });

  it('session set/get one track queue', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    const setQueueResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: oneTrackQueue });
    expect(setQueueResponse.status).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.body).toEqual({ queue: oneTrackQueue });

    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: oneTrackQueue });
  });

  it('session set/get multi track queue', async () => {
    const jukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(jukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(jukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    const setQueueResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: multiTrackQueue1 });
    expect(setQueueResponse.status).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.body).toEqual({ queue: multiTrackQueue1 });

    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: multiTrackQueue1 });
  });

  it('session reorder queue', async () => {
    const testJukebox = makeMockJukebox();
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(testJukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body.jukebox.name).toEqual(testJukebox.name);
    expect(loginResponse.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse.body.role).toEqual(Role.STARTER);

    const webToken1 = getWebTokenFromResponse(loginResponse);
    expect(webToken1).not.toEqual(undefined);

    const session = await getSessionFromWebToken(webToken1);
    const jukeboxDb = await getJukeboxByName(testJukebox.name);

    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken1);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);

    const setQueueResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: multiTrackQueue1 });
    expect(setQueueResponse.status).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(setQueueResponse.body).toEqual({ queue: multiTrackQueue1 });

    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: multiTrackQueue1 });

    const setQueueReorderResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: multiTrackQueue1Reordered });
    expect(setQueueReorderResponse.status).toBe(StatusCodes.CREATED);
    expect(setQueueReorderResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(setQueueReorderResponse.body).toEqual({ queue: multiTrackQueue1Reordered });

    const getQueueReorderResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueReorderResponse.status).toBe(StatusCodes.OK);
    expect(getQueueReorderResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueReorderResponse.body).toEqual({ queue: multiTrackQueue1Reordered });
  });
});
