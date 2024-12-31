import Wrapper from '../wrappers/Payload';
import { useQueueContext } from '../pages/jukebox';
import customFetch from '../utils/customFetch';
import { albumPath, artistPath } from '../utils/paths';
import { Link } from 'react-router-dom';
import { SEARCH_TYPE } from '../utils/constants';

const Tracks = ({ tracks, setPayloadType, setPayload, albumDisplay }) => {
  const { queue, updateQueue } = useQueueContext();

  const addToQueue = (track) => {
    const exists = queue.find((existing) => track.id == existing.id);
    if (!exists) {
      updateQueue(track);
    } else {
      // TODO add feedback that track is already in queue
      console.log('this track already exists in queue, not adding');
    }
  };

  const openAlbum = async (track) => {
    const response = await customFetch.post(albumPath, { id: track?.album?.id });
    setPayloadType(SEARCH_TYPE.ALBUM);
    setPayload(response.data.data.items);
  };

  const openArtist = async (track) => {
    const response = await customFetch.post(artistPath, { id: track?.artists[0]?.id });
    setPayloadType(SEARCH_TYPE.ARTIST);
    setPayload(response.data.data.items);
  };

  return (
    <Wrapper>
      {tracks.map((track, index) => (
        <div key={index} className='payload'>
          {!albumDisplay && (
            <img className='image' onClick={() => openAlbum(track)} src={track?.album?.images[2]?.url} alt='' />
          )}
          <button className='payload-btn' onClick={() => addToQueue(track)}>
            <p>
              {track?.name} | <Link onClick={() => openArtist(track)}>{track?.artists[0]?.name}</Link>
            </p>
          </button>
        </div>
      ))}
    </Wrapper>
  );
};

export default Tracks;
