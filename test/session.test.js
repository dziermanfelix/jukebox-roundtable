import { jukeboxCreatePath, loginPath, jukeboxPrivatePath, setQueuePath, getQueuePath } from '../common/paths';
import { deleteJukeboxSuccess, jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { createSession, getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl, multiTrackQueue1, multiTrackQueue1Reordered, oneTrackQueue } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { getQueueOrderForJukebox } from '../routes/queueOrderController';
import { serverApp as app } from './setup';
import { serverRequest as request } from './setup';

describe('session', () => {
  it('session login check contents', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('create duplicate session attempt', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const req = { role: 'starter' };
    const newSession = await createSession(req, jukeboxDb, webToken);
    expect(newSession).toBe(null);
  });

  it('cleanup many sessions', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const webTokens = [];
    const sessions = [];
    for (let count = 0; count < 10; count++) {
      let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
      let webToken = getWebTokenFromResponse(loginResponse);
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
  });

  it('session get empty queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: [] });
  });

  it('session set/get one track queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
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
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
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
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
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
