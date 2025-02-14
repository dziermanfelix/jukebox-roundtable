import Wrapper from '../wrappers/Player';
import { accessTokenPath, playNextTrackPath, queueNextTrackPath } from '../../../common/paths';
import { useEffect, useState } from 'react';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import { useJukeboxContext } from '../pages/Jukebox';
import { KeepAwake } from '.';

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
          customFetch.post(`${playNextTrackPath}${name}`, { deviceId: device_id });
        });

        player.addListener('playback_error', (error) => {
          console.error('playback error:', error.message);
        });

        player.addListener('player_state_changed', (state) => {
          const currentTrack = state.track_window.current_track;
          setTrack(currentTrack);
        });

        let readyToQueue = true;
        let noProgressCount = 0;
        const intervalId = setInterval(() => {
          player.getCurrentState().then((state) => {
            if (state) {
              const position = state.position;
              const duration = state.duration;
              const progressPercentage = (position / duration) * 100;
              const remaining = (duration - position) / 1000;
              if (progressPercentage === 0) {
                noProgressCount += 1;
                if (noProgressCount >= 4) {
                  setStarted(false);
                  clearInterval(intervalId);
                }
              }
              console.log(`${progressPercentage}\%, ${remaining}s`);
              if (position / 1000 <= 2) {
                readyToQueue = true;
              }
              if (remaining <= 31 && readyToQueue) {
                customFetch.post(`${queueNextTrackPath}${name}`);
                readyToQueue = false;
              }
            }
          });
        }, 1000);

        player.connect();
        setPlayer(player);
      };
    }
    setStarted(true);
  }

  return (
    <Wrapper>
      <div>
        <div>
          {track && isStarted && (
            <div>
              <KeepAwake />
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
