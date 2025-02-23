import Wrapper from '../wrappers/Player';
import { accessTokenPath, playNextTrackPath, queueNextTrackPath } from '../../../common/paths';
import { useEffect, useState } from 'react';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import { useJukeboxContext } from '../pages/Jukebox';
import { KeepAwake } from '.';
import { convertMsToDisplayTime } from '../../../utils/time';

const Player = ({ loggedOut }) => {
  const { name } = useJukeboxContext();
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isStarted, setStarted] = useState(false);
  const [track, setTrack] = useState(null);

  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

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

  useEffect(() => {
    if (loggedOut) {
      if (player) {
        player.disconnect();
      }
    }
  }, [loggedOut]);

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
          (async () => {
            await customFetch.post(`${playNextTrackPath}${name}`, { deviceId: device_id });
          })();
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device has gone offline:', device_id);
        });

        player.addListener('playback_error', (error) => {
          console.error('playback error:', error.message);
        });

        player.addListener('player_state_changed', (state) => {
          const currentTrack = state.track_window.current_track;
          setTrack(currentTrack);
        });

        player.addListener('initialization_error', ({ message }) => {
          console.log('Web SDK initialization error:', message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.log('auth error:', message);
        });

        player.addListener('account_error', ({ message }) => {
          console.log('account error:', message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.log('playback error:', message);
        });

        let readyToQueue = true;
        let notPlayingCount = 0;
        const intervalId = setInterval(() => {
          player.getCurrentState().then((state) => {
            if (state) {
              const position = state.position;
              const duration = state.duration;
              setDuration(duration);
              setPosition(position);
              const progressPercentage = (position / duration) * 100;
              const remaining = (duration - position) / 1000;
              if (progressPercentage === 0) {
                notPlayingCount += 1;
                checkNotPlaying(notPlayingCount, intervalId);
              }
              if (position / 1000 <= 2) {
                readyToQueue = true;
              }
              if (remaining <= 11 && readyToQueue) {
                customFetch.post(`${queueNextTrackPath}${name}`);
                readyToQueue = false;
              }
            } else {
              notPlayingCount += 1;
              checkNotPlaying(notPlayingCount, intervalId);
            }
          });
        }, 1000);

        player.connect();
        setPlayer(player);
      };
    }
    setStarted(true);
  }

  function checkNotPlaying(notPlayingCount, intervalId) {
    if (notPlayingCount >= 7) {
      setStarted(false);
      clearInterval(intervalId);
    }
  }

  return (
    <Wrapper>
      {track && isStarted && (
        <div className='playing'>
          <KeepAwake />
          <div className='info'>
            <div>{track?.name}</div>
            <div>{track?.artists[0]?.name}</div>
            <div>
              {convertMsToDisplayTime(position)} / {convertMsToDisplayTime(duration)}
            </div>
          </div>
          <div className='album-cover'>
            <img className='album-image' src={track?.album?.images[2]?.url} alt='' />
          </div>
        </div>
      )}
      {!isStarted && <button onClick={() => initJukebox()}>START</button>}
    </Wrapper>
  );
};

export default Player;
