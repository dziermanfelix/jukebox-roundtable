import { serverSocket } from '../server.js';
import { updateQueueEvent, updateTrackEvent } from '../utils/socketEvents.js';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { getQueueDb, setQueueDb } from './queueController.js';
import { getJukeboxDb } from './jukeboxController.js';

export const startJukeboxRequest = async (req, res) => {
  startJukebox(req.params.id, req.body.deviceId, req.body.sessionId);
};

export async function startJukebox(jukebox, deviceId, sessionId) {
  let track = await playNextTrack(jukebox, deviceId, sessionId);
  while ((await getJukeboxDb(jukebox)) && track) {
    let total = track.duration_ms;
    let midpoint = Math.floor(total / 2);
    let warning = total - 30000;
    let queueNext = total - 10000;
    let nextTrack = undefined;
    const tenSecondsTimeout = new Promise((resolve) => {
      setTimeout(() => {
        console.log(`10 seconds ${track.name}`);
        resolve();
      }, 10000);
    });
    const midpointTimeout = new Promise((resolve) => {
      setTimeout(() => {
        console.log(`midpoint ${track.name}`);
        resolve();
      }, midpoint);
    });
    const warningTimeout = new Promise((resolve) => {
      setTimeout(() => {
        console.log(`warning ${track.name}`);
        resolve();
      }, warning);
    });
    const queueNextTimeout = new Promise((resolve) => {
      setTimeout(async () => {
        nextTrack = await addNextTrackToPlayerQueue(jukebox, deviceId, sessionId);
        resolve();
      }, queueNext);
    });
    const totalTimeout = new Promise((resolve) => {
      setTimeout(() => {
        if (nextTrack) {
          serverSocket.emit(updateTrackEvent, nextTrack);
          track = nextTrack;
        }
        resolve();
      }, total);
    });
    await Promise.all([tenSecondsTimeout, midpointTimeout, warningTimeout, queueNextTimeout, totalTimeout]);
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
    console.log('error adding next track:');
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
    serverSocket.emit(updateTrackEvent, track);
    return track;
  } catch (error) {
    console.log('error playing next track:');
    console.log(error);
  }
}

export const getNextTrack = async (jukebox, sessionId) => {
  console.log(`get queue for ${jukebox} ${sessionId}`);
  const queue = await getQueueDb(jukebox, sessionId);
  const tracks = queue.tracks;
  const track = tracks.shift();
  queue.tracks = tracks;
  await setQueueDb(jukebox, sessionId, queue);
  serverSocket.emit(updateQueueEvent, queue.tracks);
  return track;
};
