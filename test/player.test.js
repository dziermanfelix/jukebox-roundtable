import { jukeboxCreatePath, loginPath, jukeboxPrivatePath, setQueuePath, getQueuePath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import { deleteJukeboxSuccess, jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { createSession, getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl, multiTrackQueue1, multiTrackQueue1Reordered, oneTrackQueue } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { getQueueOrderForJukebox } from '../routes/queueOrderController';

describe('session', () => {
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
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([{ _id: session._id }]));
  });
});
