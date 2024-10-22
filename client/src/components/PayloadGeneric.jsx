import { Artists, Albums, Tracks } from '.';

const PayloadGeneric = ({ items, setter }) => {
  const type = items[0].type;
  if (type == 'track') {
    return <Tracks tracks={items} />;
  } else if (type === 'artist') {
    return <Artists artists={items} setter={setter} />;
  } else if (type === 'album') {
    return <Albums albums={items} setter={setter} />;
  }
  return <div>Payload Type Generic Error</div>;
};
export default PayloadGeneric;
