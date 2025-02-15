import { albumPath } from '../../../common/paths';
import Wrapper from '../wrappers/Payload';
import customFetch from '../../../common/customFetch';
import { SEARCH_TYPE } from '../utils/constants';
import { useJukeboxContext } from '../pages/Jukebox';

const Albums = ({ albums, setPayloadType, setPayload }) => {
  const { name } = useJukeboxContext();

  const openAlbum = async (album) => {
    const response = await customFetch.post(albumPath, { jukebox: name, id: album?.id });
    setPayloadType(SEARCH_TYPE.ALBUM);
    setPayload(response.data.data.items);
  };

  return (
    <Wrapper>
      {albums.map((album, index) => (
        <div key={index} className='payload'>
          <button className='album-only' onClick={() => openAlbum(album)}>
            <img className='album-image' src={album?.images[2]?.url} alt='' />
            <p className='info'>{album?.name}</p>
          </button>
        </div>
      ))}
    </Wrapper>
  );
};

export default Albums;
