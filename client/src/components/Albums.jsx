import { Payload } from '.';
import { albumPath } from '../utils/paths';
import Wrapper from '../wrappers/Payload';
import customFetch from '../utils/customFetch';

const Albums = ({ albums, setter }) => {
  const openAlbum = async (album) => {
    console.log(`opening album`);
    const response = await customFetch.post(albumPath, { id: album?.id });
    console.log(response.data.data);
    setter(response.data.data.items);
  };

  return (
    <Wrapper>
      <div className='image-container'>
        {albums.map((album, index) => (
          <div key={index}>
            <Payload
              onClick={() => openAlbum(album)}
              line1={album?.name}
              line2={album?.artists[0]?.name}
              imageUrl={album?.images[2]?.url}
            />
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
export default Albums;
