import { redirect, useLoaderData } from 'react-router-dom';
import { spotifyLoginUrlPath, basePath } from '../../../common/paths';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get(spotifyLoginUrlPath);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(basePath);
  }
};

const SpotifyLogin = () => {
  const { url: loginUrl } = useLoaderData();
  return (
    <div>
      <p>You are starting a new jukebox</p>
      <p>You must log in to spotify to continue.</p>
      <button onClick={() => (window.location.href = loginUrl)}>Spotify Login</button>
    </div>
  );
};

export default SpotifyLogin;
