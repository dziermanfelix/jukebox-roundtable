import { connectedUsers, serverSocket } from '../server.js';
import { updateQueueEvent } from '../utils/socketEvents.js';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { getQueueFromSessionId, setQueueForSessionId } from './queueController.js';
import { getPreviousSession, setPreviousSession, updateJukeboxPlayedTracks } from './jukeboxController.js';
import { getOrderDb } from './queueOrderController.js';
import { StatusCodes } from 'http-status-codes';
import { delay } from '../utils/time.js';

function emitter(sessionId, event, data) {
  const socketId = connectedUsers[sessionId];
  serverSocket.to(socketId).emit(event, data);
}

export async function playNextTrackHttp(req, res) {
  const jukeboxName = req.params.id;
  const deviceId = req.body.deviceId;
  const track = await getNextTrack(jukeboxName);
  if (track) {
    const token = await getAccessToken(jukeboxName);
    try {
      await delay(1000);
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [track.uri],
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      return track;
    } catch (error) {
      console.log('error playing next track');
      console.log(error);
    }
  }
  return res.status(StatusCodes.OK).json({ msg: `${track?.name} added to player` });
}

export async function queueNextTrack(req, res) {
  const jukeboxName = req.params.id;
  const track = await getNextTrack(jukeboxName);
  if (track) {
    const token = await getAccessToken(jukeboxName);
    try {
      var options = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      axios.post(`https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`, null, options);
    } catch (error) {
      console.log('error adding next track');
      console.log(error.status);
    }
  }
  return res.status(StatusCodes.OK).json({ track });
}

export const getNextTrack = async (jukeboxName) => {
  let track = undefined;
  let queue = [];
  let sessionId = '';
  const order = await getOrderDb(jukeboxName);
  const numSessionsInJukebox = order.length;
  let numEmptyQueue = -1;
  while (queue.length === 0) {
    sessionId = await getNextSessionId(jukeboxName);
    queue = await getQueueFromSessionId(sessionId);
    numEmptyQueue += 1;
    if (numEmptyQueue === numSessionsInJukebox) {
      queue = null;
      break;
    }
  }
  if (queue) {
    track = queue.shift();
    if (track) {
      await setQueueForSessionId(sessionId, queue);
      await updateJukeboxPlayedTracks(jukeboxName, track);
      emitter(sessionId, updateQueueEvent, queue);
    }
  }
  return track;
};

export const getNextSessionId = async (jukeboxName) => {
  const order = await getOrderDb(jukeboxName);
  const previousSession = await getPreviousSession(jukeboxName);
  let prevIndex = -1;
  if (previousSession) {
    prevIndex = order.indexOf(previousSession);
  }
  const nextIndex = (prevIndex + 1) % order.length;
  const sessionId = order.at(nextIndex);
  await setPreviousSession(jukeboxName, sessionId);
  return sessionId;
};
