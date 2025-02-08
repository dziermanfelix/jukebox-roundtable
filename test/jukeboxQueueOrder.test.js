// import { getOrderPath, jukeboxCreatePath, loginPath, logoutPath, setOrderPath } from '../common/paths';
// import { jukeboxSuccessfulLogin, jukeboxSuccessfulLogout } from '../common/responseMessages';
// import { StatusCodes } from 'http-status-codes';
// import { getWebTokenFromResponse } from '../utils/tokenUtils';
// import { getSessionFromWebToken } from '../routes/sessionController';
// import { makeUrl } from './setup';
// import { getJukeboxByName } from '../routes/jukeboxController';
// import { getOrderDb, getQueueOrderForJukebox } from '../routes/queueOrderController';
// import { serverApp as app } from './setup';
// import { serverRequest as request } from './setup';

// describe('queue order', () => {
//   it('login check queue order', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     // get backend like player
//     const orderBeforeLogin = await getQueueOrderForJukebox(jukebox.name);
//     expect(JSON.stringify(orderBeforeLogin)).toEqual(JSON.stringify([]));
//     // get http
//     const getOrderBeforeLogin = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
//     expect(getOrderBeforeLogin.status).toBe(StatusCodes.OK);
//     expect(getOrderBeforeLogin.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(getOrderBeforeLogin.body)).toEqual(JSON.stringify({ sessions: [] }));
//     let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//     expect(loginResponse.status).toBe(StatusCodes.OK);
//     expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//     expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//     let webToken = getWebTokenFromResponse(loginResponse);
//     expect(webToken).not.toEqual(undefined);
//     const jukeboxDb = await getJukeboxByName(jukebox.name);
//     const session = await getSessionFromWebToken(webToken);
//     expect(session).not.toBe(null);
//     expect(session.webToken).toEqual(webToken);
//     expect(session.jukebox).toEqual(jukeboxDb._id);
//     expect(session.role).toEqual('starter');
//     expect(session.displayName).toEqual('player1');
//     expect(session.queue).toEqual([]);
//     // get backend like player
//     const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
//     expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
//     // get http
//     const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukeboxDb.name}`));
//     expect(getOrderResponse.status).toBe(StatusCodes.OK);
//     expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(getOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
//   });

//   it('logout check queue order', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     // get backend like player
//     const orderBeforeLogin = await getQueueOrderForJukebox(jukebox.name);
//     expect(JSON.stringify(orderBeforeLogin)).toEqual(JSON.stringify([]));
//     // get http
//     const getOrderBeforeLogin = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
//     expect(getOrderBeforeLogin.status).toBe(StatusCodes.OK);
//     expect(getOrderBeforeLogin.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(getOrderBeforeLogin.body)).toEqual(JSON.stringify({ sessions: [] }));
//     let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//     expect(loginResponse.status).toBe(StatusCodes.OK);
//     expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//     expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//     let webToken = getWebTokenFromResponse(loginResponse);
//     expect(webToken).not.toEqual(undefined);
//     const jukeboxDb = await getJukeboxByName(jukebox.name);
//     const session = await getSessionFromWebToken(webToken);
//     expect(session).not.toBe(null);
//     expect(session.webToken).toEqual(webToken);
//     expect(session.jukebox).toEqual(jukeboxDb._id);
//     expect(session.role).toEqual('starter');
//     expect(session.displayName).toEqual('player1');
//     expect(session.queue).toEqual([]);
//     // get backend like player
//     const jukeboxQueueOrder = await getQueueOrderForJukebox(jukebox.name);
//     expect(JSON.stringify(jukeboxQueueOrder)).toEqual(JSON.stringify([session._id]));
//     // get http
//     const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
//     expect(getOrderResponse.status).toBe(StatusCodes.OK);
//     expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(getOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
//     const logoutResponse = await request(app)
//       .post(makeUrl(logoutPath))
//       .set('Cookie', `webToken=${webToken}`)
//       .send({ name: jukebox.name, sessionId: session._id });
//     expect(logoutResponse.status).toBe(StatusCodes.OK);
//     expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
//     expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));
//     const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
//     expect(webTokenAfterLogout).toBe('');
//     const sessionAfterLogout = await getSessionFromWebToken(webToken);
//     expect(sessionAfterLogout).toBe(null);
//     // get backend like player
//     const orderAfterLogout = await getQueueOrderForJukebox(jukebox.name);
//     expect(JSON.stringify(orderAfterLogout)).toEqual(JSON.stringify([]));
//     // get http
//     const getOrderAfterLogout = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
//     expect(getOrderAfterLogout.status).toBe(StatusCodes.OK);
//     expect(getOrderAfterLogout.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(getOrderAfterLogout.body)).toEqual(JSON.stringify({ sessions: [] }));
//   });

//   it('queue order set/get order', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//     expect(loginResponse.status).toBe(StatusCodes.OK);
//     expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//     expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//     let webToken = getWebTokenFromResponse(loginResponse);
//     expect(webToken).not.toEqual(undefined);
//     const jukeboxDb = await getJukeboxByName(jukebox.name);
//     let session = await getSessionFromWebToken(webToken);
//     expect(session).not.toBe(null);
//     expect(session.webToken).toEqual(webToken);
//     expect(session.jukebox).toEqual(jukeboxDb._id);
//     expect(session.role).toEqual('starter');
//     expect(session.displayName).toEqual('player1');
//     expect(session.queue).toEqual([]);
//     const setOrderResponse = await request(app)
//       .post(makeUrl(`${setOrderPath}${jukeboxDb.name}`))
//       .send({ order: [session] });
//     expect(setOrderResponse.status).toBe(StatusCodes.OK);
//     expect(setOrderResponse.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(setOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
//     const getOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukeboxDb.name}`));
//     expect(getOrderResponse.status).toBe(StatusCodes.OK);
//     expect(getOrderResponse.statusCode).toBe(StatusCodes.OK);
//     expect(JSON.stringify(setOrderResponse.body)).toEqual(JSON.stringify({ sessions: [session._id] }));
//   });

//   it('queue order reorder', async () => {
//     const expectedSessions = [];
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     for (let i = 0; i < 10; i++) {
//       let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//       expect(loginResponse.status).toBe(StatusCodes.OK);
//       expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//       expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//       let webToken = getWebTokenFromResponse(loginResponse);
//       expect(webToken).not.toEqual(undefined);
//       let jukeboxDb = await getJukeboxByName(jukebox.name);
//       let session = await getSessionFromWebToken(webToken);
//       expect(session).not.toBe(null);
//       expect(session.webToken).toEqual(webToken);
//       expect(session.jukebox).toEqual(jukeboxDb._id);
//       expect(session.queue).toEqual([]);
//       expectedSessions.push(session._id);
//     }
//     for (let i = 0; i < 10; i++) {
//       const shuffledSessions = expectedSessions.sort(() => Math.random() - 0.5);
//       const setSessionOrderResponse = await request(app)
//         .post(makeUrl(`${setOrderPath}${jukebox.name}`))
//         .send({ order: shuffledSessions });
//       expect(setSessionOrderResponse.status).toBe(StatusCodes.OK);
//       expect(setSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
//       expect(JSON.stringify(setSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: shuffledSessions }));
//       const getSessionOrderResponse = await request(app).get(makeUrl(`${getOrderPath}${jukebox.name}`));
//       expect(getSessionOrderResponse.status).toBe(StatusCodes.OK);
//       expect(getSessionOrderResponse.statusCode).toBe(StatusCodes.OK);
//       expect(JSON.stringify(setSessionOrderResponse.body)).toEqual(JSON.stringify({ sessions: shuffledSessions }));
//     }
//   });

//   it('queue order login single', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//     expect(loginResponse.status).toBe(StatusCodes.OK);
//     expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//     expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//     let webToken = getWebTokenFromResponse(loginResponse);
//     expect(webToken).not.toEqual(undefined);
//     const jukeboxDb = await getJukeboxByName(jukebox.name);
//     let session = await getSessionFromWebToken(webToken);
//     expect(session).not.toBe(null);
//     expect(session.webToken).toEqual(webToken);
//     expect(session.jukebox).toEqual(jukeboxDb._id);
//     expect(session.role).toEqual('starter');
//     expect(session.displayName).toEqual('player1');
//     expect(session.queue).toEqual([]);
//     const sessionOrder = await getOrderDb(jukeboxDb.name);
//     expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify([session._id]));
//   });

//   it('queue order login multiple', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     let expectedSessions = [];
//     for (let i = 0; i < 10; i++) {
//       let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//       expect(loginResponse.status).toBe(StatusCodes.OK);
//       expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//       expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//       let webToken = getWebTokenFromResponse(loginResponse);
//       expect(webToken).not.toEqual(undefined);
//       const jukeboxDb = await getJukeboxByName(jukebox.name);
//       let session = await getSessionFromWebToken(webToken);
//       expect(session).not.toBe(null);
//       expect(session.webToken).toEqual(webToken);
//       expect(session.jukebox).toEqual(jukeboxDb._id);
//       expect(session.role).toEqual('starter');
//       expect(session.displayName).toEqual('player1');
//       expect(session.queue).toEqual([]);
//       const sessionOrder = await getOrderDb(jukeboxDb.name);
//       expectedSessions.push(session._id);
//       expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify(expectedSessions));
//     }
//   });

//   it('queue order logout', async () => {
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//     expect(loginResponse.status).toBe(StatusCodes.OK);
//     expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//     expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//     let webToken = getWebTokenFromResponse(loginResponse);
//     expect(webToken).not.toEqual(undefined);
//     const jukeboxDb = await getJukeboxByName(jukebox.name);
//     let session = await getSessionFromWebToken(webToken);
//     expect(session).not.toBe(null);
//     expect(session.webToken).toEqual(webToken);
//     expect(session.jukebox).toEqual(jukeboxDb._id);
//     expect(session.role).toEqual('starter');
//     expect(session.displayName).toEqual('player1');
//     expect(session.queue).toEqual([]);
//     const sessionOrder = await getOrderDb(jukeboxDb.name);
//     expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify([session._id]));
//     const logoutResponse = await request(app)
//       .post(makeUrl(logoutPath))
//       .set('Cookie', `webToken=${webToken}`)
//       .send({ name: jukebox.name, sessionId: session._id });
//     expect(logoutResponse.status).toBe(StatusCodes.OK);
//     expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
//     expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, session._id));
//     const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
//     expect(webTokenAfterLogout).toBe('');
//     const sessionAfterLogout = await getSessionFromWebToken(webToken);
//     expect(sessionAfterLogout).toBe(null);
//     const sessionOrderAfterLogout = await getOrderDb(jukeboxDb.name);
//     expect(JSON.stringify(sessionOrderAfterLogout)).toEqual(JSON.stringify([]));
//   });

//   it('queue order logout multiple', async () => {
//     const numSessions = 10;
//     const jukebox = { name: 'dust', code: 'dust', spotifyCode: '', role: 'starter' };
//     await request(app).post(makeUrl(jukeboxCreatePath)).send(jukebox);
//     let sessionIds = [];
//     let webTokens = [];
//     let expectedSessionOrder = [];
//     let webToken = undefined;
//     for (let i = 0; i < numSessions; i++) {
//       let loginResponse = await request(app).post(makeUrl(loginPath)).send(jukebox);
//       expect(loginResponse.status).toBe(StatusCodes.OK);
//       expect(loginResponse.statusCode).toBe(StatusCodes.OK);
//       expect(loginResponse.body).toEqual(jukeboxSuccessfulLogin(jukebox.name));
//       webToken = getWebTokenFromResponse(loginResponse);
//       expect(webToken).not.toEqual(undefined);
//       const jukeboxDb = await getJukeboxByName(jukebox.name);
//       let session = await getSessionFromWebToken(webToken);
//       expect(session).not.toBe(null);
//       expect(session.webToken).toEqual(webToken);
//       expect(session.jukebox).toEqual(jukeboxDb._id);
//       expect(session.role).toEqual('starter');
//       expect(session.displayName).toEqual('player1');
//       expect(session.queue).toEqual([]);
//       webTokens.push(webToken);
//       sessionIds.push(session._id);
//       const sessionOrder = await getOrderDb(jukeboxDb.name);
//       expectedSessionOrder.push(session._id);
//       expect(JSON.stringify(sessionOrder)).toEqual(JSON.stringify(expectedSessionOrder));
//     }
//     for (let i = 0; i < numSessions; i++) {
//       let sessionId = sessionIds.at(i);
//       let webToken = webTokens.at(i);
//       expectedSessionOrder.shift();
//       const logoutResponse = await request(app)
//         .post(makeUrl(logoutPath))
//         .set('Cookie', `webToken=${webToken}`)
//         .send({ name: jukebox.name, sessionId: sessionId });
//       expect(logoutResponse.status).toBe(StatusCodes.OK);
//       expect(logoutResponse.statusCode).toBe(StatusCodes.OK);
//       expect(logoutResponse.body).toEqual(jukeboxSuccessfulLogout(jukebox.name, sessionId));
//       const webTokenAfterLogout = getWebTokenFromResponse(logoutResponse);
//       expect(webTokenAfterLogout).toBe('');
//       const sessionAfterLogout = await getSessionFromWebToken(webToken);
//       expect(sessionAfterLogout).toBe(null);
//       const sessionOrderAfterLogout = await getOrderDb(jukebox.name);
//       expect(JSON.stringify(sessionOrderAfterLogout)).toEqual(JSON.stringify(expectedSessionOrder));
//     }
//   });
// });
