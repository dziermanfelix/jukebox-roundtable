import { useJukeboxContext } from '../pages/Jukebox';
import { Reorder } from 'framer-motion';
import { FiMinus } from 'react-icons/fi';
import { FaArrowUp } from 'react-icons/fa';

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
            <Reorder.Item
              className='flex justify-between cursor-grab border rounded-2xl p-2 mb-1'
              key={track.id}
              value={track}
            >
              <div>{displayInfo(track?.artists[0]?.name, track?.name)}</div>
              <div className='p-0.5 mr-1 space-x-1 rounded opacity-0 hover:opacity-100'>
                <button className='p-0.5 rounded hover:bg-gray-300' onClick={() => removeFromQueue(track)}>
                  <FiMinus />
                </button>
                <button className='p-0.5 rounded hover:bg-gray-300' onClick={() => pushToTopOfQueue(track)}>
                  <FaArrowUp />
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
