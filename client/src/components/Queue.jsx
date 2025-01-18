import Wrapper from '../wrappers/Queue';
import { useJukeboxContext } from '../pages/Jukebox';
import { Reorder } from 'framer-motion';
import { updateQueueEvent } from '../../../utils/socketEvents';

const Queue = () => {
  const { session, queue, updateQueue, reorderQueue, socket } = useJukeboxContext();

  socket.on(updateQueueEvent, (tracks) => {
    updateQueue(session._id, tracks);
  });

  const removeFromQueue = (track) => {
    const tracks = [...queue];
    const index = tracks.indexOf(track);
    if (index > -1) {
      tracks.splice(index, 1);
    }
    updateQueue(session._id, tracks);
  };

  return (
    <Wrapper>
      <div>
        <h3>Queue</h3>
        <Reorder.Group axis='y' values={queue} onReorder={reorderQueue}>
          {queue.map((track) => (
            <Reorder.Item key={track.id} value={track} className='list-item'>
              {track?.name}
              <button className='remove-btn' onClick={() => removeFromQueue(track)}>
                x
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </Wrapper>
  );
};

export default Queue;
