import { redirect } from 'react-router-dom';
import { jukeboxPath, initAccessTokenPath, basePath } from '@common/paths';
import customFetch from '@common/customFetch';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
  const name = localStorage.getItem('jukeboxName');
  if (name) {
    localStorage.removeItem('jukeboxName');
    await customFetch.post(initAccessTokenPath, { name: name, spotifyCode: params.code });
    return redirect(`${jukeboxPath}${name}`);
  } else {
    return redirect(`${basePath}`);
  }
};

const Callback = () => {
  return <div></div>;
};

export default Callback;
