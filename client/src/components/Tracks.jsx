import Wrapper from '../wrappers/Payload';
import { useQueueContext } from '../pages/jukebox';
import customFetch from '../utils/customFetch';
import { albumPath, artistPath } from '../utils/paths';
import { Link } from 'react-router-dom';
import { SEARCH_TYPE } from '../utils/constants';

const Tracks = ({ tracks, setPayloadType, setPayload, albumDisplay }) => {
  const { queue, updateQueue } = useQueueContext();

  const addToQueue = (track) => {
    updateQueue([...queue, track]);
  };

  const existsInQueue = (track) => {
    return queue.find((existing) => track.id == existing.id);
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
          {!existsInQueue(track) && (
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
