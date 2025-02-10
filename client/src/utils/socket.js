import io from 'socket.io-client';
import { serverUrl, serverPort } from '../utils/frontEndEnv';

export function createSocketConnection(jukeboxName, sessionId) {
  const connString = `${serverUrl}:${serverPort}/?jukeboxName=${jukeboxName}&&sessionId=${sessionId}`;
  // const connString = `${serverUrl}/?jukeboxName=${jukeboxName}&&sessionId=${sessionId}`;
  console.log(`creating socket conn with ${connString}`);
  return io(connString, { transports: ['websocket'] });
}
