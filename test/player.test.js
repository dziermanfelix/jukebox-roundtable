import { getQueuePath, jukeboxCreatePath, loginPath, setQueuePath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import { jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl, multiTrackQueue1, oneTrackQueue } from './setup';
import { getQueueOrderForJukebox } from '../routes/queueOrderController';
import { getNextTrack } from '../routes/playerController';

describe('player', () => {
  it('player get queue order single', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('player get next track empty queue', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    let webToken = getWebTokenFromResponse(loginResponse);
    const session = await getSessionFromWebToken(webToken);
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
    const nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack).toBe(undefined);
  });

  it('player get next track one queue one track', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    let webToken = getWebTokenFromResponse(loginResponse);
    const session = await getSessionFromWebToken(webToken);
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
    let nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack).toBe(undefined);
    const setQueueResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: oneTrackQueue });
    expect(setQueueResponse.body).toEqual({ queue: oneTrackQueue });
    let getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.body).toEqual({ queue: oneTrackQueue });
    nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack.id).toEqual(oneTrackQueue.at(0).id);
    getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.body).toEqual({ queue: [] });
  });

  it('player get next track one queue multi track', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    let webToken = getWebTokenFromResponse(loginResponse);
    const session = await getSessionFromWebToken(webToken);
    const setQueueResponse = await request(app)
      .post(makeUrl(`${setQueuePath}${session._id}`))
      .send({ sessionId: session._id, queue: multiTrackQueue1 });
    expect(setQueueResponse.body).toEqual({ queue: multiTrackQueue1 });
    let getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.body).toEqual({ queue: multiTrackQueue1 });
    const expectedTracks = [...multiTrackQueue1];
    for (const track of multiTrackQueue1) {
      let nextTrack = await getNextTrack(jukebox.name);
      expect(nextTrack.id).toEqual(track.id);
      expectedTracks.shift();
      getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
      expect(getQueueResponse.body).toEqual({ queue: expectedTracks });
    }
    const nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack).toBe(undefined);
    getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
    expect(getQueueResponse.body).toEqual({ queue: [] });
  });
});
