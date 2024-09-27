import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <div>
      <h1>Landing</h1>
      <Link to='/start'>start</Link>
      <Link to='/join'>join</Link>
    </div>
  );
}
export default Landing