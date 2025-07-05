import { albumPath } from '../../../common/paths';
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
    <div className='border rounded p-2'>
      {albums.map((album, index) => (
        <button
          key={index}
          className='p-2 mb-2 w-full flex items-stretch gap-2 rounded border-2 border-black hover:border-3'
          onClick={() => openAlbum(album)}
        >
          <div className='w-full flex items-stretch gap-2'>
            <img className='aspect-square h-full max-h-40 flex-shrink-0' src={album?.images[2]?.url} alt='' />
            <div className='flex items-center justify-center'>
              <p>{album?.name}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Albums;
