import Wrapper from '../wrappers/Queue';
import { useJukeboxContext } from '../pages/Jukebox';
import { Reorder } from 'framer-motion';

const Queue = () => {
  const { queue, updateQueue } = useJukeboxContext();

  const removeFromQueue = (track) => {
    const tracks = [...queue];
    const index = tracks.indexOf(track);
    if (index > -1) {
      tracks.splice(index, 1);
    }
    updateQueue(tracks);
  };

  return (
    <Wrapper>
      <div>
        <h3>Queue</h3>
        <Reorder.Group axis='y' values={queue} onReorder={updateQueue}>
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
