import { serverSocket } from '../server.js';
import { updateQueueEvent, updateTrackEvent } from '../utils/socketEvents.js';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { getQueueDb, setQueueDb } from './queueController.js';

export function startJukebox(jukebox, deviceId) {
  console.log(`start jukebox=${jukebox} on device ${deviceId}`);
  playNextTrack(jukebox, deviceId);
}

async function playNextTrack(jukebox, deviceId) {
  const track = await getNextTrack(jukebox);
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
  } catch (error) {
    console.log('error playing next track:');
    console.log(error);
  }
}

export const getNextTrack = async (jukebox) => {
  const queue = await getQueueDb(jukebox, 'specialmink');
  const tracks = queue.tracks;
  const track = tracks.shift();
  queue.tracks = tracks;
  await setQueueDb(jukebox, 'specialmink', queue);
  serverSocket.emit(updateQueueEvent, queue.tracks);
  return track;
};
