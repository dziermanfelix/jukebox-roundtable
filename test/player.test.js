import { getQueuePath, jukeboxCreatePath, loginPath, setQueuePath } from '../common/paths';
import { jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeMockJukebox, makeUrl, multiTrackQueue1, oneTrackQueue, q1, q2, q3, q4 } from './setup';
import { getOrderDb } from '../routes/queueOrderController';
import { getNextTrack } from '../routes/playerController';
import { serverApp as app } from './setup';
import { serverRequest as request } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';

describe('player', () => {
  it('player get next track empty queue', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    expect(jukeboxDb).not.toEqual(null);
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(null);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toEqual(null);
    const nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack).toBe(undefined);
  });

  it('player get next track one queue one track', async () => {
    const jukebox = makeMockJukebox();
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    let webToken = getWebTokenFromResponse(loginResponse);
    const session = await getSessionFromWebToken(webToken);
    const jukeboxQueueOrder = await getOrderDb(jukebox.name);
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
    const jukebox = makeMockJukebox();
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

  it('player many sessions sim', async () => {
    const expectations = {
      s1: { jukebox: undefined, webToken: undefined, q: q1, remainingQ: q1, good: true },
      s2: { jukebox: undefined, webToken: undefined, q: q2, remainingQ: q2, good: true },
      s3: { jukebox: undefined, webToken: undefined, q: q3, remainingQ: q3, good: true },
      s4: { jukebox: undefined, webToken: undefined, q: q4, remainingQ: q4, good: true },
    };
    expectations.s1.jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    expectations.s2.jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'joiner' };
    expectations.s3.jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'joiner' };
    expectations.s4.jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'joiner' };
    const jukebox = expectations.s1.jukebox;
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    for (const s in expectations) {
      const jukebox = expectations[s].jukebox;
      const queue = expectations[s].q;
      let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      let webToken = getWebTokenFromResponse(loginResponse);
      expectations[s].webToken = webToken;
      const session = await getSessionFromWebToken(webToken);
      const setQueueResponse = await request(app)
        .post(makeUrl(`${setQueuePath}${session._id}`))
        .send({ sessionId: session._id, queue: queue });
      expect(setQueueResponse.body).toEqual(expect.objectContaining({ queue: queue }));
      let getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
      expect(getQueueResponse.body).toEqual({ queue: queue });
    }
    let i = -1;
    while (allGood(expectations)) {
      i = (i + 1) % Object.keys(expectations).length;
      const expectation = expectations[Object.keys(expectations)[i]];
      if (expectation.remainingQ.length > 0) {
        let nextExpectedTrack = expectation.remainingQ.shift();
        let nextTrack = await getNextTrack(jukebox.name);
        expect(nextTrack.id).toEqual(nextExpectedTrack.id);
        const webToken = expectation.webToken;
        const session = await getSessionFromWebToken(webToken);
        const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
        expect(getQueueResponse.body).toEqual({ queue: expectation.remainingQ });
      }
    }
    // no next track
    const nextTrack = await getNextTrack(jukebox.name);
    expect(nextTrack).toBe(undefined);
    // check all queues are empty
    for (const k in expectations) {
      const expectation = expectations[k];
      const webToken = expectation.webToken;
      const session = await getSessionFromWebToken(webToken);
      const getQueueResponse = await request(app).get(makeUrl(`${getQueuePath}${session._id}`));
      expect(getQueueResponse.body).toEqual({ queue: [] });
    }
  });
  function allGood(expectations) {
    for (const k in expectations) {
      if (expectations[k].remainingQ.length > 0) return true;
    }
    return false;
  }
});
