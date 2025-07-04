import Wrapper from '../wrappers/Queue';
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
    <Wrapper>
      <h3 className='capitalize'>{displayName}'s queue</h3>
      <div className='queue'>
        <Reorder.Group axis='y' values={queue} onReorder={reorderQueue}>
          {queue.map((track) => (
            <Reorder.Item className='list-item' key={track.id} value={track}>
              <div className='info'>{displayInfo(track?.artists[0]?.name, track?.name)}</div>
              <div className='queue-tools'>
                <button className='tool-button' onClick={() => removeFromQueue(track)}>
                  <MdDeleteForever />
                </button>
                <button className='tool-button' onClick={() => pushToTopOfQueue(track)}>
                  <FaRegArrowAltCircleUp />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </Wrapper>
  );
};

export default Queue;
