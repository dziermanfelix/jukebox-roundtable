import io from 'socket.io-client';
import { serverUrl, serverPort } from '../utils/frontEndEnv';

export function createSocketConnection(jukeboxName, sessionId) {
  return io(`${serverUrl}:${serverPort}/?jukeboxName=${jukeboxName}&&sessionId=${sessionId}`);
}
