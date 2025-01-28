import { Link } from 'react-router-dom';
import { basePath } from '../../../common/paths';
import img from '/favicon.ico';

const HomeLogoLink = () => {
  return (
    <Link to={basePath}>
      <img src={img} alt='yeebob' />
    </Link>
  );
};
export default HomeLogoLink;
