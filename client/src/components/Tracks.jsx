import { Payload } from '.';
import Wrapper from '../wrappers/Payload';
import { useQueueContext } from '../pages/jukebox';

const Tracks = ({ tracks }) => {
  const { queue, updateQueue } = useQueueContext();

  const addToQueue = (track) => {
    const trackName = track.name;
    if (!queue.includes(trackName)) {
      console.log(`adding track ${trackName} to queue`);
      updateQueue(trackName);
    } else {
      console.log(`track ${trackName} exists in queue!!!!`);
    }
  };

  return (
    <Wrapper>
      <div className='image-container'>
        {tracks.map((track, index) => (
          <div key={index}>
            <Payload
              payload={track}
              className='track'
              line1={track?.name}
              line2={track?.artists[0]?.name}
              imageUrl={track?.album?.images[2]?.url}
              onClick={addToQueue}
            />
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
export default Tracks;
