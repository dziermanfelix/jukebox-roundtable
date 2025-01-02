import Wrapper from '../wrappers/Queue';
import { useQueueContext } from '../pages/jukebox';
import { Reorder, motion } from 'framer-motion';
import { useState } from 'react';

const Queue = () => {
  const { queue, removeFromQueue, setQueue } = useQueueContext();
  // const [items, setItems] = useState(['rancid', 'nofx', 'bouncing souls']);

  const setItems = (items) => {
    setQueue(items);
  };

  return (
    <Wrapper>
      <div>
        <h3>Queue</h3>
        <Reorder.Group axis='y' values={queue} onReorder={setItems}>
          {queue.map((track, index) => (
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
