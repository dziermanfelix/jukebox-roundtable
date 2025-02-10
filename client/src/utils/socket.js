import io from 'socket.io-client';
import { serverUrl, serverPort, socketEnv } from '../utils/frontEndEnv';

export function createSocketConnection(jukeboxName, sessionId) {
  let connString = `${serverUrl}/?jukeboxName=${jukeboxName}&&sessionId=${sessionId}`;
  if (socketEnv === 'local') {
    connString = `${serverUrl}:${serverPort}/?jukeboxName=${jukeboxName}&&sessionId=${sessionId}`;
  }
  console.log(`creating socket conn with ${connString}`);
  return io(connString, { transports: ['websocket'] });
}
