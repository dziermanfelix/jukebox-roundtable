import { connectedUsers, serverSocket } from '../server.js';
import { updateQueueEvent, updateTrackEvent } from '../utils/socketEvents.js';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { getQueueFromSessionId, setQueueForSessionId } from './queueController.js';
import { jukeboxExistsByName, updateJukeboxPlayedTracks } from './jukeboxController.js';
import { delay } from '../utils/time.js';
import { getOrderDb } from './queueOrderController.js';

let previous = undefined;

function emitter(sessionId, event, data) {
  const socketId = connectedUsers[sessionId];
  serverSocket.to(socketId).emit(event, data);
}

export const startJukeboxRequest = async (req, res) => {
  jukeboxEngine(req.params.id, req.body.deviceId, req.body.sessionId);
};

export async function jukeboxEngine(jukeboxName, deviceId, sessionId) {
  let { id: queuedTrackId } = await playNextTrack(jukeboxName, deviceId, sessionId);
  let readyToQueueTrack = true;
  while (await jukeboxExistsByName(jukeboxName)) {
    let current = await getCurrentPlaying(jukeboxName);
    if (current && current !== '' && current.is_playing) {
      if (current.item.id === queuedTrackId) {
        readyToQueueTrack = true;
      }
      const remaining = current.item.duration_ms - current.progress_ms;
      const midpoint = Math.floor(remaining / 2);
      if (remaining <= 30000 && readyToQueueTrack) {
        const nextTrack = await addNextTrackToPlayerQueue(jukeboxName);
        queuedTrackId = nextTrack.id;
        readyToQueueTrack = false;
      }
      await delay(midpoint);
    }
    // TODO either reconnect player or kill jukebox
  }
}

async function getCurrentPlaying(jukeboxName) {
  const token = await getAccessToken(jukeboxName);
  try {
    var options = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', options);
    return response.data;
  } catch (error) {
    console.log('error getting current playing');
    console.log(error);
  }
}

async function addNextTrackToPlayerQueue(jukeboxName) {
  const track = await getNextTrack(jukeboxName);
  const token = await getAccessToken(jukeboxName);
  try {
    var options = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    };
    axios.post(`https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`, null, options);
    return track;
  } catch (error) {
    console.log('error adding next track');
    console.log(error.status);
  }
}

async function playNextTrack(jukeboxName, deviceId, sessionId) {
  const track = await getNextTrack(jukeboxName);
  const token = await getAccessToken(jukeboxName);
  try {
    var data = {
      uris: [track.uri],
    };
    var options = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    };
    await axios.put(`https://api.spotify.com/v1/me/player/play/?device_id=${deviceId}`, data, options);
    await updateJukeboxPlayedTracks(jukeboxName, track);
    emitter(sessionId, updateTrackEvent, track);
    return track;
  } catch (error) {
    console.log('error playing next track');
    console.log(error);
  }
}

export const getNextTrack = async (jukeboxName) => {
  // TODO handle no next track
  const sessionId = await getNextSessionId(jukeboxName);
  const queue = await getQueueFromSessionId(sessionId);
  const track = queue.shift();
  if (track) {
    await setQueueForSessionId(sessionId, queue);
    await updateJukeboxPlayedTracks(jukeboxName, track);
    emitter(sessionId, updateQueueEvent, queue);
  }
  return track;
};

export const getNextSessionId = async (jukeboxName) => {
  const order = await getOrderDb(jukeboxName);
  let prevIndex = -1;
  if (previous) {
    prevIndex = order.indexOf(previous);
  }
  const nextIndex = (prevIndex + 1) % order.length;
  const sessionId = order.at(nextIndex);
  previous = sessionId;
  return sessionId;
};
