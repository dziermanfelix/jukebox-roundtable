import Wrapper from '../wrappers/Player';
import { accessTokenPath, getNextTrackPath } from '../../../common/paths';
import { useRef, useEffect, useState } from 'react';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import { useJukeboxContext } from '../pages/Jukebox';

const Player = () => {
  const { name } = useJukeboxContext();
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isStarted, setStarted] = useState(false);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const { data } = await customFetch.post(accessTokenPath, { jukebox: name });
        setToken(data.accessToken);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    getAccessToken();
  }, []);

  async function initJukebox() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    if (!player) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: `Jukebox Roundtable`,
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        player.addListener('ready', ({ device_id }) => {
          setPlayer(player);
          runJukebox(device_id);
        });

        player.addListener('playback_error', (error) => {
          console.error('playback error:', error.message);
        });

        player.addListener('player_state_changed', ({ position, duration, track_window: { current_track } }) => {
          console.log('player state changed, current track: ', current_track);
          setTrack({ name: current_track?.name, artists: current_track?.artists, album: current_track?.album });
        });

        player.connect();
      };
    }
    setStarted(true);
  }

  async function runJukebox(deviceId) {
    await playNextTrack(deviceId);
    addNextTrackToPlayerQueue();
  }

  async function playNextTrack(deviceId) {
    const { data: track } = await customFetch.get(`${getNextTrackPath}${name}`);
    if (track) {
      try {
        var data = {
          uris: [track.uri],
        };
        var options = {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        };
        await customFetch.put(`https://api.spotify.com/v1/me/player/play/?device_id=${deviceId}`, data, options);
        return track;
      } catch (error) {
        console.log('error playing next track');
        console.log(error);
      }
    }
  }

  async function addNextTrackToPlayerQueue() {
    const { data: track } = await customFetch.get(`${getNextTrackPath}${name}`);
    if (track) {
      try {
        var options = {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        };
        customFetch.post(`https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`, null, options);
      } catch (error) {
        console.log('error adding next track');
        console.log(error);
      }
    }
    return track;
  }

  return (
    <Wrapper>
      <div>
        <div>
          {track && (
            <div>
              <div>{track?.name}</div>
              <div>{track?.artists[0]?.name}</div>
              <div>{track?.album?.name}</div>
            </div>
          )}
        </div>
        <div>{!isStarted && <button onClick={() => initJukebox()}>{!isStarted && 'START'}</button>}</div>
      </div>
    </Wrapper>
  );
};
export default Player;
