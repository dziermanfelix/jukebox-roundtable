import { jukeboxCreatePath, jukeboxLoginPath, jukeboxPath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import { deleteJukeboxSuccess, jukeboxSuccessfulLogin } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl } from './setup';

describe('jukebox', () => {
  it('cleanup many sessions', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const webTokens = [];
    const sessions = [];
    for (let count = 0; count < 10; count++) {
      let loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox);
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
      .delete(`${makeUrl(jukeboxPath)}/${jukebox.name}`)
      .set('Cookie', `webToken=${webTokens[0]}`);
    expect(deleteJukeboxResponse.status).toBe(StatusCodes.OK);
    expect(deleteJukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(deleteJukeboxResponse.body)).toBe(JSON.stringify(deleteJukeboxSuccess(jukebox.name)));
    for (const webToken of webTokens) {
      const sessionAfterDelete = await getSessionFromWebToken(webToken);
      expect(sessionAfterDelete).toBe(null);
    }
  });
});
