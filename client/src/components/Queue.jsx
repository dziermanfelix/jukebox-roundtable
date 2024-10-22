import Wrapper from '../wrappers/Queue';
import { useQueueContext } from '../pages/jukebox';

const Queue = () => {
  const { queue } = useQueueContext();

  return (
    <Wrapper>
      <h3>Your Next Song</h3>
      {queue.map((q, index) => (
        <div key={index}>
          <ul>{q}</ul>
        </div>
      ))}
    </Wrapper>
  );
};
export default Queue;
