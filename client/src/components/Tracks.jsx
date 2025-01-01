import Wrapper from '../wrappers/Payload';
import { useQueueContext } from '../pages/jukebox';
import customFetch from '../utils/customFetch';
import { albumPath, artistPath } from '../utils/paths';
import { Link } from 'react-router-dom';
import { SEARCH_TYPE } from '../utils/constants';

const Tracks = ({ tracks, setPayloadType, setPayload, albumDisplay }) => {
  const { queue, addToQueue } = useQueueContext();

  const addUniqueToQueue = (track) => {
    const exists = queue.find((existing) => track.id == existing.id);
    if (!exists) {
      addToQueue(track);
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
          <button className='add-to-queue' onClick={() => addUniqueToQueue(track)}>
            add
          </button>
        </div>
      ))}
    </Wrapper>
  );
};

export default Tracks;
