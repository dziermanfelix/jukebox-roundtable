import Wrapper from '../wrappers/Player';
import { accessTokenPath, startJukeboxPath } from '../../../common/paths';
import { useEffect, useState } from 'react';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import { useJukeboxContext } from '../pages/Jukebox';
import { updateTrackEvent } from '../../../utils/socketEvents';

const Player = () => {
  const { name, session, socket } = useJukeboxContext();
  const [token, setToken] = useState(undefined);
  const [player, setPlayer] = useState(undefined);
  const [isStarted, setStarted] = useState(false);
  const [track, setTrack] = useState(undefined);

  if (socket) {
    socket.on(updateTrackEvent, (track) => {
      setTrack(track);
    });
  }

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

  async function startJukebox() {
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
          try {
            customFetch.post(`${startJukeboxPath}${name}`, { deviceId: device_id, sessionId: session._id });
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.msg);
          }

          player.addListener('playback_error', (error) => {
            console.error('playback error:', error.message);
          });

          setStarted(true);
        });

        player.connect();

        setPlayer(player);
      };
    }
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
        <div>{!isStarted && <button onClick={() => startJukebox()}>{!isStarted && 'START'}</button>}</div>
      </div>
    </Wrapper>
  );
};
export default Player;
