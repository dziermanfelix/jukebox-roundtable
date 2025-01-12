import Wrapper from '../wrappers/Player';
import { accessTokenPath, nextTrackPath } from '../utils/paths';
import { useEffect, useState } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useJukeboxContext } from '../pages/Jukebox';

const Player = () => {
  const { name } = useJukeboxContext();
  const [token, setToken] = useState(undefined);
  const [player, setPlayer] = useState(undefined);
  const [isStarted, setStarted] = useState(false);
  const [track, setTrack] = useState(undefined);

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
        setPlayer(player);
        player.connect();

        player.addListener('ready', ({ device_id }) => {
          playNextTrack(device_id);
          setStarted(true);
        });
      };
    }
  }

  async function playNextTrack(device_id) {
    const track = await getNextTrackFromQueue();
    try {
      var data = {
        uris: [track.uri],
      };
      var options = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      await customFetch.put(`https://api.spotify.com/v1/me/player/play/?device_id=${device_id}`, data, options);
      setTrack(track);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  }

  async function getNextTrackFromQueue() {
    try {
      const { data } = await customFetch.post(`${nextTrackPath}${name}`, { username: 'specialmink' });
      return data.track;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
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
