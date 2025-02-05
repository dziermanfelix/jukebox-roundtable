import Wrapper from '../wrappers/Payload';
import { useJukeboxContext } from '../pages/Jukebox';
import customFetch from '../../../common/customFetch';
import { albumPath, artistPath, playedTracksPath } from '../../../common/paths';
import { Link } from 'react-router-dom';
import { SEARCH_TYPE } from '../utils/constants';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Tracks = ({ tracks, setPayloadType, setPayload, albumDisplay }) => {
  const { name, session, queue, updateQueue } = useJukeboxContext();
  const [playedTracks, setPlayedTracks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await customFetch.get(`${playedTracksPath}${name}`);
        setPlayedTracks(data.playedTracks);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    fetch();
  }, [queue]);

  const addToQueue = (track) => {
    updateQueue([...queue, track]);
  };

  const addButton = (track) => {
    const trackInQueue = queue.find((item) => track.id == item.id);
    const trackAlreadyPlayed = playedTracks.find((item) => track.id == item.id);
    return !trackInQueue && !trackAlreadyPlayed;
  };

  const openAlbum = async (track) => {
    const response = await customFetch.post(albumPath, { jukebox: name, id: track?.album?.id });
    setPayloadType(SEARCH_TYPE.ALBUM);
    setPayload(response.data.data.items);
  };

  const openArtist = async (track) => {
    const response = await customFetch.post(artistPath, { jukebox: name, id: track?.artists[0]?.id });
    setPayloadType(SEARCH_TYPE.ARTIST);
    setPayload(response.data.data.items);
  };

  return (
    <Wrapper>
      {tracks.map((track, index) => (
        <div key={index} className='payload'>
          {!albumDisplay && (
            <button className='album-btn'>
              <img className='album-img' onClick={() => openAlbum(track)} src={track?.album?.images[2]?.url} alt='' />
            </button>
          )}
          <div className='info'>
            <p>
              {albumDisplay && `${index + 1}.`} {track?.name} |{' '}
              <Link onClick={() => openArtist(track)}>{track?.artists[0]?.name}</Link>
            </p>
          </div>
          {addButton(track) && (
            <button className='add-to-queue' onClick={() => addToQueue(track)}>
              add
            </button>
          )}
        </div>
      ))}
    </Wrapper>
  );
};

export default Tracks;
