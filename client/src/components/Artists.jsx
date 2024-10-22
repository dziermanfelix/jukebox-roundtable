import { Payload } from '.';
import { artistPath } from '../utils/paths';
import Wrapper from '../wrappers/Payload';
import customFetch from '../utils/customFetch';

const Artists = ({ artists, setter }) => {
  const openArtist = async (artist) => {
    const response = await customFetch.post(artistPath, { id: artist?.id });
    setter(response.data.data.items);
  };

  return (
    <Wrapper>
      <div className='image-container'>
        {artists.map((artist, index) => (
          <div key={index}>
            <Payload
              line1={artist?.name}
              line2=''
              imageUrl={artist?.images[2]?.url}
              onClick={() => openArtist(artist)}
            />
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
export default Artists;
