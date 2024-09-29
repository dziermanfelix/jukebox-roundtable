import { Payload } from '.';
import Wrapper from '../wrappers/Payload';

const Tracks = ({ tracks }) => {
  const addToQueue = (track) => {
    console.log(`adding track ${track.name} to queue`);
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
