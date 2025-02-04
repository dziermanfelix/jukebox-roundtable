import { jukeboxCreatePath, loginPath, jukeboxPrivatePath, setQueuePath, getQueuePath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import { deleteJukeboxSuccess, jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl, multiTrackQueue1, multiTrackQueue1Reordered, oneTrackQueue } from './setup';

describe('session', () => {
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

  it('get empty queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.status).toBe(StatusCodes.OK);
    expect(getQueueResponse.statusCode).toBe(StatusCodes.OK);
    expect(getQueueResponse.body).toEqual({ queue: [] });
  });

  it('set/get one track queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
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

  it('set/get multi track queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
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

  it('reorder queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
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
