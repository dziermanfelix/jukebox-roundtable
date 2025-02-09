import { jukeboxCreatePath, loginPath, jukeboxPrivatePath, sessionPath } from '../common/paths';
import {
  deleteJukeboxSuccess,
  jukeboxExistsError,
  notAuthorizedToJoinJukebox,
  noToken,
} from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse, getWebTokenKey } from '../utils/tokenUtils';
import { makeMockJukebox, makeUrl } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { serverApp as app } from './setup';
import { serverRequest as request } from './setup';
import { Role } from '../utils/roles';

describe('jukebox', () => {
  it('jukebox create', async () => {
    const jukebox = makeMockJukebox();
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({ jukebox: { name: jukebox.name } });
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    expect(jukeboxDb.name).toEqual(jukebox.name);
    expect(jukeboxDb.code).not.toBe(null);
    expect(jukeboxDb.accessToken).not.toBe(null);
    expect(jukeboxDb.playedTracks).toEqual([]);
    expect(jukeboxDb.queueOrder).toEqual([]);
  });

  it('jukebox create error duplicate', async () => {
    const jukebox = makeMockJukebox();
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    const response = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.error.text).toBe(JSON.stringify(jukeboxExistsError(jukebox.name)));
  });

  it('jukebox get success', async () => {
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
    const getJukeboxResponse = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox.name)}=${webToken}`);
    expect(getJukeboxResponse.status).toBe(StatusCodes.OK);
    expect(getJukeboxResponse.statusCode).toBe(StatusCodes.OK);
    expect(getJukeboxResponse.body).toMatchObject({ jukebox: { name: jukebox.name } });
    const getSessionResponse = await request(app)
      .get(`${makeUrl(sessionPath)}/${jukebox.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox.name)}=${webToken}`);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    const session = getSessionResponse.body.session;
    expect(session.webToken).toEqual(webToken);
    expect(JSON.stringify(session.jukebox)).toEqual(JSON.stringify(jukeboxDb._id));
    expect(session.role).toEqual(Role.STARTER);
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
  });

  it('jukebox get error no web token', async () => {
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
    const getJukeboxResponse = await request(app).get(`${makeUrl(jukeboxPrivatePath)}/${jukebox.name}`);
    expect(getJukeboxResponse.status).toBe(StatusCodes.FORBIDDEN);
    expect(getJukeboxResponse.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(getJukeboxResponse.error.text).toBe(JSON.stringify(noToken()));
  });

  it('jukebox get error wrong web token', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '' };
    const createJukeboxResponse1 = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    expect(createJukeboxResponse1.status).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse1.statusCode).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse1.body).toMatchObject({ jukebox: { name: jukebox1.name } });

    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '' };
    const createJukeboxResponse2 = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    expect(createJukeboxResponse2.status).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse2.statusCode).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse2.body).toMatchObject({ jukebox: { name: jukebox2.name } });

    const loginResponse1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    expect(loginResponse1.status).toBe(StatusCodes.OK);
    expect(loginResponse1.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse1.body.jukebox.name).toEqual(jukebox1.name);
    expect(loginResponse1.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse1.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse1.body.role).toEqual(Role.JOINER);

    const webToken1 = getWebTokenFromResponse(loginResponse1);
    expect(webToken1).not.toEqual(undefined);

    const loginResponse2 = await request(app).post(makeUrl(loginPath)).send(jukebox2);
    expect(loginResponse2.status).toBe(StatusCodes.OK);
    expect(loginResponse2.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse2.body.jukebox.name).toEqual(jukebox2.name);
    expect(loginResponse2.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse2.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse2.body.role).toEqual(Role.JOINER);

    const webToken2 = getWebTokenFromResponse(loginResponse2);
    expect(webToken2).not.toEqual(undefined);

    const getJukeboxResponse1 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox1.name)}=${webToken1}`);
    expect(getJukeboxResponse1.status).toBe(StatusCodes.OK);
    expect(getJukeboxResponse1.statusCode).toBe(StatusCodes.OK);
    expect(getJukeboxResponse1.body).toMatchObject({ jukebox: { name: jukebox1.name } });

    const getJukeboxResponse2 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox2.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox2.name)}=${webToken2}`);
    expect(getJukeboxResponse2.status).toBe(StatusCodes.OK);
    expect(getJukeboxResponse2.statusCode).toBe(StatusCodes.OK);
    expect(getJukeboxResponse2.body).toMatchObject({ jukebox: { name: jukebox2.name } });

    const getJukeboxResponseWrongJukebox = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox2.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox2.name)}=${webToken1}`);
    expect(getJukeboxResponseWrongJukebox.status).toBe(StatusCodes.FORBIDDEN);
    expect(getJukeboxResponseWrongJukebox.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(getJukeboxResponseWrongJukebox.error.text).toBe(JSON.stringify(notAuthorizedToJoinJukebox(jukebox2.name)));
  });

  it('jukebox delete success', async () => {
    const jukebox1 = { name: 'dust', code: 'dust', spotifyCode: '' };
    const createJukeboxResponse1 = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox1);
    expect(createJukeboxResponse1.status).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse1.statusCode).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse1.body).toMatchObject({ jukebox: { name: jukebox1.name } });

    const jukebox2 = { name: 'dered', code: 'dered', spotifyCode: '' };
    const createJukeboxResponse2 = await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox2);
    expect(createJukeboxResponse2.status).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse2.statusCode).toBe(StatusCodes.CREATED);
    expect(createJukeboxResponse2.body).toMatchObject({ jukebox: { name: jukebox2.name } });

    const loginResponse1 = await request(app).post(makeUrl(loginPath)).send(jukebox1);
    expect(loginResponse1.status).toBe(StatusCodes.OK);
    expect(loginResponse1.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse1.body.jukebox.name).toEqual(jukebox1.name);
    expect(loginResponse1.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse1.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse1.body.role).toEqual(Role.JOINER);

    const webToken1 = getWebTokenFromResponse(loginResponse1);
    expect(webToken1).not.toEqual(undefined);

    const loginResponse2 = await request(app).post(makeUrl(loginPath)).send(jukebox2);
    expect(loginResponse2.status).toBe(StatusCodes.OK);
    expect(loginResponse2.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse2.body.jukebox.name).toEqual(jukebox2.name);
    expect(loginResponse2.body.jukebox.queueOrder).toEqual([]);
    expect(loginResponse2.body.jukebox.playedTracks).toEqual([]);
    expect(loginResponse2.body.role).toEqual(Role.JOINER);

    const webToken2 = getWebTokenFromResponse(loginResponse2);
    expect(webToken2).not.toEqual(undefined);

    const getJukeboxResponse1 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox1.name)}=${webToken1}`);
    expect(getJukeboxResponse1.status).toBe(StatusCodes.OK);
    expect(getJukeboxResponse1.statusCode).toBe(StatusCodes.OK);
    expect(getJukeboxResponse1.body).toMatchObject({ jukebox: { name: jukebox1.name } });

    const getJukeboxResponse2 = await request(app)
      .get(`${makeUrl(jukeboxPrivatePath)}/${jukebox2.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox2.name)}=${webToken2}`);
    expect(getJukeboxResponse2.status).toBe(StatusCodes.OK);
    expect(getJukeboxResponse2.statusCode).toBe(StatusCodes.OK);
    expect(getJukeboxResponse2.body).toMatchObject({ jukebox: { name: jukebox2.name } });

    const deleteJukeboxResponse1 = await request(app)
      .delete(`${makeUrl(jukeboxPrivatePath)}/${jukebox1.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox1.name)}=${webToken1}`);
    expect(deleteJukeboxResponse1.status).toBe(StatusCodes.OK);
    expect(deleteJukeboxResponse1.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(deleteJukeboxResponse1.body)).toBe(JSON.stringify(deleteJukeboxSuccess(jukebox1.name)));

    const deleteJukeboxResponse2 = await request(app)
      .delete(`${makeUrl(jukeboxPrivatePath)}/${jukebox2.name}`)
      .set('Cookie', `${getWebTokenKey(jukebox2.name)}=${webToken2}`);
    expect(deleteJukeboxResponse2.status).toBe(StatusCodes.OK);
    expect(deleteJukeboxResponse2.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(deleteJukeboxResponse2.body)).toBe(JSON.stringify(deleteJukeboxSuccess(jukebox2.name)));
  });
});
