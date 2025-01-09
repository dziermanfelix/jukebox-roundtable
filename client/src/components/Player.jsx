import Wrapper from '../wrappers/Player';
import SpotifyPlayer from 'react-spotify-web-playback';
import { accessTokenPath } from '../utils/paths';
import { useEffect, useState } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

const Player = () => {
  const [trackUri, setTrackUri] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await customFetch.get(accessTokenPath);
        setAccessToken(data.accessToken);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    fetch();
  }, []);

  const handlePlayTrack = () => {
    console.log('play button pressed');
    setTrackUri('spotify:track:0sINnE3mBBeHrnzQweyOG');
  };

  return (
    <Wrapper>
      <div>
        <button onClick={handlePlayTrack}>Play</button>
        {/* <SpotifyPlayer className='web-player' token={accessToken} uri={trackUri} /> */}
        <SpotifyPlayer token={accessToken} />
      </div>
    </Wrapper>
  );
};
export default Player;
