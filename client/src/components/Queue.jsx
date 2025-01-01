import Wrapper from '../wrappers/Queue';
import { useQueueContext } from '../pages/jukebox';

const Queue = () => {
  const { queue, removeFromQueue } = useQueueContext();

  return (
    <Wrapper>
      <h3>Queue</h3>
      {queue &&
        queue.map((track, index) => (
          <div key={index} className='track'>
            <ul>
              {track.name}
              <button onClick={() => removeFromQueue(track)}> remove </button>
            </ul>
          </div>
        ))}
    </Wrapper>
  );
};
export default Queue;
