import { useJukeboxContext } from '../pages/Jukebox';
import customFetch from '../../../common/customFetch';
import { albumPath, artistPath, playedTracksPath } from '../../../common/paths';
import { Link } from 'react-router-dom';
import { SEARCH_TYPE } from '../utils/constants';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { convertMsToDisplayTime } from '../../../utils/time';
import { MdOutlineAddCircleOutline } from 'react-icons/md';

const Tracks = ({ tracks, setPayloadType, setPayload, albumDisplay }) => {
  const { name, queue, updateQueue } = useJukeboxContext();
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
    <div className='border rounded'>
      {tracks.map((track, index) => (
        <div key={index} className='p-2 m-2 flex items-stretch gap-2 rounded border-2 border-black'>
          {!albumDisplay && (
            <button className='w-20 h-20 flex-shrink-0 hover:border-2 hover:border-black rounded'>
              <img
                className='aspect-square h-full max-h-40 flex-shrink-0'
                onClick={() => openAlbum(track)}
                src={track?.album?.images[2]?.url}
                alt=''
              />
            </button>
          )}
          <div className='overflow-x-scroll w-full flex items-center justify-center'>
            <p>
              {albumDisplay && `${index + 1}.`} {track?.name} |{' '}
              <Link
                className='text-blue-400 hover:bg-gray-200 hover:border-3 hover:border-black hover:text-xl rounded'
                onClick={() => openArtist(track)}
              >
                {track?.artists[0]?.name}
              </Link>{' '}
              | {convertMsToDisplayTime(track?.duration_ms)}
            </p>
          </div>
          <div className='w-20'>
            {addButton(track) && (
              <button
                className='w-full h-full flex items-center justify-center hover:border-2 hover:border-black text-2xl hover:text-3xl rounded'
                onClick={() => addToQueue(track)}
              >
                <MdOutlineAddCircleOutline className='' />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tracks;
