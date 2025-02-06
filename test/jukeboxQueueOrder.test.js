import { getOrderPath, jukeboxCreatePath, loginPath, logoutPath, setOrderPath } from '../common/paths';
import { app } from '../app';
import request from 'supertest';
import { jukeboxSuccessfulLogin, jukeboxSuccessfulLogout } from '../common/responseMessages';
import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromResponse } from '../utils/tokenUtils';
import { getSessionFromWebToken } from '../routes/sessionController';
import { makeUrl } from './setup';
import { getJukeboxByName } from '../routes/jukeboxController';
import { getOrderDb, getQueueOrderForJukebox } from '../routes/queueOrderController';

const queue1 = [
  [
    {
      id: '7jm8Fq5juL6aYdQC3aHj83',
      uri: 'spotify:track:7jm8Fq5juL6aYdQC3aHj83',
      name: 'Tomorrow Never Comes',
      album: {
        images: [
          {
            height: 640,
            width: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b2737adf5fda6d4aa68732d534fb',
          },
          {
            height: 300,
            width: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e027adf5fda6d4aa68732d534fb',
          },
          {
            height: 64,
            width: 64,
            url: 'https://i.scdn.co/image/ab67616d000048517adf5fda6d4aa68732d534fb',
          },
        ],
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
          },
          href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
          id: '6xTk3EK5T9UzudENVvu9YB',
          name: 'Rancid',
          type: 'artist',
          uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
        },
      ],
      duration_ms: 145367,
    },
    {
      id: '39uIrqxNaqGlJ8MKAHkyVb',
      uri: 'spotify:track:39uIrqxNaqGlJ8MKAHkyVb',
      name: 'Maxwell Murder',
      album: {
        images: [
          {
            height: 640,
            width: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b27322efa7f978acba74b2c8741a',
          },
          {
            height: 300,
            width: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e0222efa7f978acba74b2c8741a',
          },
          {
            height: 64,
            width: 64,
            url: 'https://i.scdn.co/image/ab67616d0000485122efa7f978acba74b2c8741a',
          },
        ],
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
          },
          href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
          id: '6xTk3EK5T9UzudENVvu9YB',
          name: 'Rancid',
          type: 'artist',
          uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
        },
      ],
      duration_ms: 85863,
    },
  ],
];
const queue2 = [
  {
    id: '4uB28m7RAflobYpnLMb6A2',
    uri: 'spotify:track:4uB28m7RAflobYpnLMb6A2',
    name: 'Linoleum',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b00c510f182b92234ca2b93d',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b00c510f182b92234ca2b93d',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b00c510f182b92234ca2b93d',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/4S2yOnmsWW97dT87yVoaSZ',
        },
        href: 'https://api.spotify.com/v1/artists/4S2yOnmsWW97dT87yVoaSZ',
        id: '4S2yOnmsWW97dT87yVoaSZ',
        name: 'NOFX',
        type: 'artist',
        uri: 'spotify:artist:4S2yOnmsWW97dT87yVoaSZ',
      },
    ],
    duration_ms: 130266,
  },
  {
    id: '0eVZhPIexAYqdwKNqSp3Qm',
    uri: 'spotify:track:0eVZhPIexAYqdwKNqSp3Qm',
    name: 'All Outta Angst',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273e3548bc00fbd46743eea0577',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02e3548bc00fbd46743eea0577',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851e3548bc00fbd46743eea0577',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/4S2yOnmsWW97dT87yVoaSZ',
        },
        href: 'https://api.spotify.com/v1/artists/4S2yOnmsWW97dT87yVoaSZ',
        id: '4S2yOnmsWW97dT87yVoaSZ',
        name: 'NOFX',
        type: 'artist',
        uri: 'spotify:artist:4S2yOnmsWW97dT87yVoaSZ',
      },
    ],
    duration_ms: 112493,
  },
];
const queue3 = [
  {
    id: '67HxeUADW4H3ERfaPW59ma',
    uri: 'spotify:track:67HxeUADW4H3ERfaPW59ma',
    name: 'Love Me Two Times',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b27386339e6cd71cc2a167451ee5',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e0286339e6cd71cc2a167451ee5',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d0000485186339e6cd71cc2a167451ee5',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/22WZ7M8sxp5THdruNY3gXt',
        },
        href: 'https://api.spotify.com/v1/artists/22WZ7M8sxp5THdruNY3gXt',
        id: '22WZ7M8sxp5THdruNY3gXt',
        name: 'The Doors',
        type: 'artist',
        uri: 'spotify:artist:22WZ7M8sxp5THdruNY3gXt',
      },
    ],
    duration_ms: 195106,
  },
  {
    id: '7mc2TP4Vzuyw2vNf1bLW9f',
    uri: 'spotify:track:7mc2TP4Vzuyw2vNf1bLW9f',
    name: 'Twentieth Century Fox',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b2735b96a8c5d61be8878452f8f1',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e025b96a8c5d61be8878452f8f1',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d000048515b96a8c5d61be8878452f8f1',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/22WZ7M8sxp5THdruNY3gXt',
        },
        href: 'https://api.spotify.com/v1/artists/22WZ7M8sxp5THdruNY3gXt',
        id: '22WZ7M8sxp5THdruNY3gXt',
        name: 'The Doors',
        type: 'artist',
        uri: 'spotify:artist:22WZ7M8sxp5THdruNY3gXt',
      },
    ],
    duration_ms: 151666,
  },
];
const queue4 = [
      {
        id: '5yKufQqhfr5yQ5HmcqCPTT',
        uri: 'spotify:track:5yKufQqhfr5yQ5HmcqCPTT',
        name: 'In Defense of Dorchester',
        album: {
          images: [
            {
              height: 640,
              width: 640,
              url: 'https://i.scdn.co/image/ab67616d0000b273e8adc1ddd7418130d931d8d0'
            },
            {
              height: 300,
              width: 300,
              url: 'https://i.scdn.co/image/ab67616d00001e02e8adc1ddd7418130d931d8d0'
            },
            {
              height: 64,
              width: 64,
              url: 'https://i.scdn.co/image/ab67616d00004851e8adc1ddd7418130d931d8d0'
            }
          ]
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0spqoVkfVzRyAPmA6ZY5F9'
            },
            href: 'https://api.spotify.com/v1/artists/0spqoVkfVzRyAPmA6ZY5F9',
            id: '0spqoVkfVzRyAPmA6ZY5F9',
            name: 'Street Dogs',
            type: 'artist',
            uri: 'spotify:artist:0spqoVkfVzRyAPmA6ZY5F9'
          }
        ],
        duration_ms: 151946,
      },
      {
        id: '44yuFal6SJQQW1zi38eXDn',
        uri: 'spotify:track:44yuFal6SJQQW1zi38eXDn',
        name: 'Not Without a Purpose',
        album: {
          images: [
            {
              height: 640,
              width: 640,
              url: 'https://i.scdn.co/image/ab67616d0000b273d550b2d362b54d59e2560504'
            },
            {
              height: 300,
              width: 300,
              url: 'https://i.scdn.co/image/ab67616d00001e02d550b2d362b54d59e2560504'
            },
            {
              height: 64,
              width: 64,
              url: 'https://i.scdn.co/image/ab67616d00004851d550b2d362b54d59e2560504'
            }
          ]
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0spqoVkfVzRyAPmA6ZY5F9'
            },
            href: 'https://api.spotify.com/v1/artists/0spqoVkfVzRyAPmA6ZY5F9',
            id: '0spqoVkfVzRyAPmA6ZY5F9',
            name: 'Street Dogs',
            type: 'artist',
            uri: 'spotify:artist:0spqoVkfVzRyAPmA6ZY5F9'
          }
        ],
        duration_ms: 195240,
      }
    ];

describe('queue order', () => {
  it('login check queue order', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    // get backend like player
    const orderBeforeLogin = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(orderBeforeLogin)).toEqual(JSON.stringify([]));
    // get http
    const getOrderBeforeLogin = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderBeforeLogin.status).toBe(StatusCodes.OK);
    expect(getOrderBeforeLogin.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderBeforeLogin.body)).toEqual(JSON.stringify({ sessions: [] }));
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
    // get backend like player
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
    // get http
    const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukeboxDb.name}`));
    expect(getOrderResponse.status).toBe(StatusCodes.OK);
    expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
  });

  it('logout check queue order', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    // get backend like player
    const orderBeforeLogin = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(orderBeforeLogin)).toEqual(JSON.stringify([]));
    // get http
    const getOrderBeforeLogin = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderBeforeLogin.status).toBe(StatusCodes.OK);
    expect(getOrderBeforeLogin.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderBeforeLogin.body)).toEqual(JSON.stringify({ sessions: [] }));
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
    // get backend like player
    const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
    // get http
    const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderResponse.status).toBe(StatusCodes.OK);
    expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `webToken=${webToken}`)
      .send({ name: jukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));
    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe('');
    const sessionAfterLogout = await getSessionFromWebToken(webToken);
    expect(sessionAfterLogout).toBe(null);
    // get backend like player
    const orderAfterLogout = await getQueueOrderForJukebox(jukebox.name);
    expect(JSON.stringify(orderAfterLogout)).toEqual(JSON.stringify([]));
    // get http
    const getOrderAfterLogout = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
    expect(getOrderAfterLogout.status).toBe(StatusCodes.OK);
    expect(getOrderAfterLogout.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(getOrderAfterLogout.body)).toEqual(JSON.stringify({ sessions: [] }));
  });

  it('queue order set/get order', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    let session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
    const setOrderResponse = await request(app)
      .post(makeUrl(`${setOrderPath}${jukeboxDb.name}`))
      .send({ order: [session] });
    expect(setOrderResponse.status).toBe(StatusCodes.OK);
    expect(setOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(setOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
    const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukeboxDb.name}`));
    expect(getOrderResponse.status).toBe(StatusCodes.OK);
    expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
    expect(JSON.stringify(setOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
  });

  it('queue order reorder', async () => {
    const expectedSessions = [];
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    for (let i = 0; i < 10; i++) {
      let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
      let webToken = getWebTokenFromResponse(loginResponse);
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
      expect(JSON.stringify(setSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: shuffledSessions }));
    }
  });

  it('queue order login single', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    let session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
    const sessionOrder = await getOrderDb(jukeboxDb.name);
    expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify([session._id]));
  });

  it('queue order login multiple', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let expectedSessions = [];
    for (let i = 0; i < 10; i++) {
      let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
      let webToken = getWebTokenFromResponse(loginResponse);
      expect(webToken).not.toEqual(undefined);
      const jukeboxDb = await getJukeboxByName(jukebox.name);
      let session = await getSessionFromWebToken(webToken);
      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      expect(session.jukebox).toEqual(jukeboxDb._id);
      expect(session.role).toEqual('starter');
      expect(session.displayName).toEqual('player1');
      expect(session.queue).toEqual([]);
      const sessionOrder = await getOrderDb(jukeboxDb.name);
      expectedSessions.push(session._id);
      expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify(expectedSessions));
    }
  });

  it('queue order logout', async () => {
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.statusCode).toBe(StatusCodes.OK);
    expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
    let webToken = getWebTokenFromResponse(loginResponse);
    expect(webToken).not.toEqual(undefined);
    const jukeboxDb = await getJukeboxByName(jukebox.name);
    let session = await getSessionFromWebToken(webToken);
    expect(session).not.toBe(null);
    expect(session.webToken).toEqual(webToken);
    expect(session.jukebox).toEqual(jukeboxDb._id);
    expect(session.role).toEqual('starter');
    expect(session.displayName).toEqual('player1');
    expect(session.queue).toEqual([]);
    const sessionOrder = await getOrderDb(jukeboxDb.name);
    expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify([session._id]));
    const logoutResponse = await request(app)
      .post(makeUrl(logoutPath))
      .set('Cookie', `webToken=${webToken}`)
      .send({ name: jukebox.name, sessionId: session._id });
    expect(logoutResponse.status).toBe(StatusCodes.OK);
    expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
    expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));
    const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
    expect(webTokenAfterLogout).toBe('');
    const sessionAfterLogout = await getSessionFromWebToken(webToken);
    expect(sessionAfterLogout).toBe(null);
    const sessionOrderAfterLogout = await getOrderDb(jukeboxDb.name);
    expect(JSON.stringify(sessionOrderAfterLogout)).toEqual(JSON.stringify([]));
  });

  it('queue order logout multiple', async () => {
    const numSessions = 10;
    const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
    await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
    let sessionIds = [];
    let webTokens = [];
    let expectedSessionOrder = [];
    let webToken = undefined;
    for (let i = 0; i < numSessions; i++) {
      let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
      expect(loginResponse.status).toBe(StatusCodes.OK);
      expect(loginResponse.statusCode).toBe(StatusCodes.OK);
      expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
      webToken = getWebTokenFromResponse(loginResponse);
      expect(webToken).not.toEqual(undefined);
      const jukeboxDb = await getJukeboxByName(jukebox.name);
      let session = await getSessionFromWebToken(webToken);
      expect(session).not.toBe(null);
      expect(session.webToken).toEqual(webToken);
      expect(session.jukebox).toEqual(jukeboxDb._id);
      expect(session.role).toEqual('starter');
      expect(session.displayName).toEqual('player1');
      expect(session.queue).toEqual([]);
      webTokens.push(webToken);
      sessionIds.push(session._id);
      const sessionOrder = await getOrderDb(jukeboxDb.name);
      expectedSessionOrder.push(session._id);
      expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify(expectedSessionOrder));
    }
    for (let i = 0; i < numSessions; i++) {
      let sessionId = sessionIds.at(i);
      let webToken = webTokens.at(i);
      expectedSessionOrder.shift();
      const logoutResponse = await request(app)
        .post(makeUrl(logoutPath))
        .set('Cookie', `webToken=${webToken}`)
        .send({ name: jukebox.name, sessionId: sessionId });
      expect(logoutResponse.status).toBe(StatusCodes.OK);
      expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
      expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, sessionId));
      const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
      expect(webTokenAfterLogout).toBe('');
      const sessionAfterLogout = await getSessionFromWebToken(webToken);
      expect(sessionAfterLogout).toBe(null);
      const sessionOrderAfterLogout = await getOrderDb(jukebox.name);
      expect(JSON.stringify(sessionOrderAfterLogout)).toEqual(JSON.stringify(expectedSessionOrder));
    }
  });
});
