import Wrapper from '../wrappers/Queue';
import { useQueueContext } from '../pages/jukebox';

const Queue = () => {
  const { queue } = useQueueContext();

  return (
    <Wrapper>
      <h3>Queue</h3>
      {queue &&
        queue.map((track, index) => (
          <div key={index}>
            <ul>{track.name}</ul>
          </div>
        ))}
    </Wrapper>
  );
};
export default Queue;
