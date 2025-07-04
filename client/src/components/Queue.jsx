import { useJukeboxContext } from '../pages/Jukebox';
import { Reorder } from 'framer-motion';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const Queue = () => {
  const { queue, updateQueue, reorderQueue, displayName } = useJukeboxContext();

  const removeFromQueue = (track) => {
    const tracks = [...queue];
    const index = tracks.indexOf(track);
    if (index > -1) {
      tracks.splice(index, 1);
    }
    updateQueue(tracks);
  };

  const pushToTopOfQueue = (track) => {
    let tracks = [track, ...queue.filter((item) => item !== track)];
    updateQueue(tracks);
  };

  function displayInfo(artist, name) {
    return `${name} | ${artist}`;
  }

  return (
    <div className='flex flex-col p-2'>
      <h3 className='text-center'>{`${displayName.charAt(0).toUpperCase()}${displayName.slice(1)}'s Queue`}</h3>
      <div className='mt-2'>
        <Reorder.Group axis='y' values={queue} onReorder={reorderQueue}>
          {queue.map((track) => (
            <Reorder.Item className='flex justify-between cursor-grab border rounded-2xl p-2' key={track.id} value={track}>
              <div>{displayInfo(track?.artists[0]?.name, track?.name)}</div>
              <div className='p-0.5 space-x-1 bg-gray-400 rounded opacity-0 hover:opacity-100'>
                <button className='p-0.5 border rounded hover:bg-red-500' onClick={() => removeFromQueue(track)}>
                  <MdDeleteForever />
                </button>
                <button className='p-0.5 border rounded hover:bg-blue-400' onClick={() => pushToTopOfQueue(track)}>
                  <FaRegArrowAltCircleUp />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Queue;
