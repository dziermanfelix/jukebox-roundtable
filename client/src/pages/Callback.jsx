import { redirect } from 'react-router-dom';
import { startAuthenticatedPath } from '../utils/paths';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
  const spotifyCode = params.code;
  return redirect(`${startAuthenticatedPath}?code=${spotifyCode}`);
};

const Callback = () => {
  return <div></div>;
};

export default Callback;
