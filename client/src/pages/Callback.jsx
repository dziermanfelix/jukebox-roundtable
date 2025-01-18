import { redirect } from 'react-router-dom';
import { startPath } from '../utils/paths';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
  const spotifyCode = params.code;
  return redirect(`${startPath}?code=${spotifyCode}`);
};

const Callback = () => {
  return <div></div>;
};

export default Callback;
