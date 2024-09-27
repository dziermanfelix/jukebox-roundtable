import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      <h1>Welcome to Jukebox Roundtable</h1>
      <p>We make playing your favorite songs at the party a lot easier</p>
      <p>Start or join a Jukebox Roundtable now</p>
      <Link to='/start'>start</Link>
      <Link to='/join'>join</Link>
    </div>
  );
};
export default Landing;
