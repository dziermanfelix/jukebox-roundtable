import { jukeboxCreatePath, jukeboxLoginPath, jukeboxPrivatePath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import {
  deleteJukeboxSuccess,
  jukeboxExistsError,
  jukeboxSuccessfulLogin,
  notAuthorizedToJoinJukebox,
  noToken,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeMockJukebox, makeUrl } from './setup';

describe('jukebox', () => {
  it('jukebox create', async () => {
    const testJukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({ jukebox: { name: testJukebox.name } });
  });

  it('jukebox create error duplicate', async () => {
    const testJukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(testJukebox);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.error.text).toBe(JSON.stringify(jukeboxExistsError(testJukebox.name)));
  });

  it('jukebox get success', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const jukeboxResponse = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`)
      .set('Cookie', `webToken=${webToken}`);
    expect(jukeboxResponse.status).toBe(StatusCodes.OK);
    expect(jukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(jukeboxResponse.body).toMatchObject({ jukebox: { name: jukebox1.name }, sessionId: webToken });
  });

  it('jukebox get error no web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const jukeboxResponse = await request(app).get(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`);
    expect(jukeboxResponse.status).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse.error.text).toBe(JSON.stringify(noToken()));
  });

  it('jukebox get error wrong web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox1);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox1.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const jukeboxResponse1 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`)
      .set('Cookie', `webToken=${webToken}`);
    expect(jukeboxResponse1.status).toBe(StatusCodes.OK);
    expect(jukeboxResponse1.statusCode).toBe(StatusCodes.OK);
    expect(jukeboxResponse1.body).toMatchObject({ jukebox: { name: jukebox1.name }, sessionId: webToken });
    const jukeboxResponse2 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox2.name}`)
      .set('Cookie', `webToken=${webToken}`);
    expect(jukeboxResponse2.status).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse2.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(jukeboxResponse2.error.text).toBe(JSON.stringify(notAuthorizedToJoinJukebox(jukebox2.name)));
  });

  it('jukebox delete success', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const loginResponse = await request(app).post(makeUrl(jukeboxLoginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    const webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    const deleteJukeboxResponse = await request(app)
      .delete(`${makeUrl(jukeboxPrivatePath)}/${jukebox.name}`)
      .set('Cookie', `webToken=${webToken}`);
    expect(deleteJukeboxResponse.status).toBe(StatusCodes.OK);
    expect(deleteJukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(deleteJukeboxResponse.body)).toBe(JSON.stringify(deleteJukeboxSuccess(jukebox.name)));
    const webTokenAfterDelete = getWebTokenFromResponse(deleteJukeboxResponse);
    expect(webTokenAfterDelete).toEqual(undefined);
    const sessionAfterDelete = await getSessionFromWebToken(webToken);
    expect(sessionAfterDelete).toBe(null);
  });

  it('jukebox get jukebox for many different sessions', async () => {
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
    for (const webToken of webTokens) {
      const getJukeboxResponse = await request(app)
        .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox.name}`)
        .set('Cookie', `webToken=${webToken}`);
      expect(getJukeboxResponse.status).toBe(StatusCodes.OK);
      expect(getJukeboxResponse.statusCode).toBe(StatusCodes.OK);
      expect(getJukeboxResponse.body).toMatchObject({ jukebox: { name: jukebox.name }, sessionId: webToken });
      const session = await getSessionFromWebToken(webToken);
      expect(session).not.toBe(null);
    }
  });
});
