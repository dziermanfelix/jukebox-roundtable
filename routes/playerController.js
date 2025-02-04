import { serverSocket } from '../server.js';
import { updateQueueEvent, updateTrackEvent } from '../utils/socketEvents.js';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { getQueueDb, setQueueDb } from './queueController.js';
import { getJukeboxDb, updateJukeboxPlayedTracks } from './jukeboxController.js';
import { delay } from '../utils/time.js';

export const startJukeboxRequest = async (req, res) => {
  startJukebox(req.params.id, req.body.deviceId, req.body.sessionId);
};

export async function startJukebox(jukebox, deviceId, sessionId) {
  let { id: queuedTrackId } = await playNextTrack(jukebox, deviceId, sessionId);
  let readyToQueueTrack = true;
  while (await getJukeboxDb(jukebox)) {
    let current = await getCurrentPlaying(jukebox);
    if (current !== '' && current.is_playing) {
      if (current.item.id === queuedTrackId) {
        readyToQueueTrack = true;
      }
      const remaining = current.item.duration_ms - current.progress_ms;
      const midpoint = Math.floor(remaining / 2);
      if (remaining <= 30000 && readyToQueueTrack) {
        const nextTrack = await addNextTrackToPlayerQueue(jukebox, deviceId, sessionId);
        queuedTrackId = nextTrack.id;
        readyToQueueTrack = false;
      }
      await delay(midpoint);
    }
  }
}

async function getCurrentPlaying(jukebox) {
  const token = await getAccessToken(jukebox);
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

async function addNextTrackToPlayerQueue(jukebox, deviceId, sessionId) {
  const track = await getNextTrack(jukebox, sessionId);
  const token = await getAccessToken(jukebox);
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

async function playNextTrack(jukebox, deviceId, sessionId) {
  const track = await getNextTrack(jukebox, sessionId);
  const token = await getAccessToken(jukebox);
  try {
    var data = {
      uris: [track.uri],
    };
    var options = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    };
    axios.put(`https://api.spotify.com/v1/me/player/play/?device_id=${deviceId}`, data, options);
    await updateJukeboxPlayedTracks(jukebox, track);
    serverSocket.emit(updateTrackEvent, track);
    return track;
  } catch (error) {
    console.log('error playing next track');
    console.log(error);
  }
}

export const getNextTrack = async (jukebox, sessionId) => {
  const queue = await getQueueDb(sessionId);
  const track = queue.shift();
  await setQueueDb(sessionId, queue);
  await updateJukeboxPlayedTracks(jukebox, track);
  serverSocket.emit(updateQueueEvent, queue);
  return track;
};
