import { albumPath } from '../utils/paths';
import Wrapper from '../wrappers/Payload';
import customFetch from '../utils/customFetch';
import { SEARCH_TYPE } from '../utils/constants';

const Albums = ({ albums, setPayloadType, setPayload }) => {
  const openAlbum = async (album) => {
    const response = await customFetch.post(albumPath, { id: album?.id });
    setPayloadType(SEARCH_TYPE.ALBUM);
    setPayload(response.data.data.items);
  };

  return (
    <Wrapper>
      <div className='image-container'>
        {albums.map((album, index) => (
          <div key={index}>
            <button className='track' onClick={() => openAlbum(album)}>
              <img src={album?.images[2]?.url} alt='' />
              <p className='info'>{album?.name}</p>
            </button>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default Albums;
