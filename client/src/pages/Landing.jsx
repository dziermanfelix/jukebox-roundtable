import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      <h1>Welcome to Jukebox Roundtable</h1>
      <p>Make listening to music at the party easy.</p>
      <p>Join a Jukebox Roundtable now.</p>
      <Link to='/join'>join</Link>
    </div>
  );
};
export default Landing;
