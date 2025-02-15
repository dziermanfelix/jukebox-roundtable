import Wrapper from '../wrappers/Queue';
import { useJukeboxContext } from '../pages/Jukebox';
import { Reorder } from 'framer-motion';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';
import { convertMsToDisplayTime } from '../../../utils/time';

const Queue = () => {
  const { queue, updateQueue, reorderQueue } = useJukeboxContext();

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

  return (
    <Wrapper>
      <h3>Queue</h3>
      <div className='queue'>
        <Reorder.Group axis='y' values={queue} onReorder={reorderQueue}>
          {queue.map((track) => (
            <Reorder.Item className='list-item' key={track.id} value={track}>
              {track?.artists[0]?.name} | {track?.name} | {convertMsToDisplayTime(track?.duration_ms)}
              <div className='queue-tools'>
                <button onClick={() => removeFromQueue(track)}>
                  <MdDeleteForever />
                </button>
                <button onClick={() => pushToTopOfQueue(track)}>
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
