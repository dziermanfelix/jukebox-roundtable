import { useRouteError } from 'react-router-dom';
import { HomeLogoLink } from '../components';

const Error = () => {
  const error = useRouteError();
  console.log(`Printing error in Error.jsx: ${JSON.stringify(error)}`);
  if (error.status === 404) {
    return (
      <div>
        <HomeLogoLink />
        <h3>Page not found.</h3>
        <p>This page does not yet exist. Or never will exist. You do the math.</p>
        <p>Click the logo to go back home.</p>
      </div>
    );
  }
  return (
    <div>
      <HomeLogoLink />
      <h3>You know where you are? You're in the jungle baby. You gonna dieeeeee shanananananana kneeees</h3>
    </div>
  );
};
export default Error;
