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

const Prestart = () => {
  const { url: loginUrl } = useLoaderData();
  return <button onClick={() => (window.location.href = loginUrl)}>Spotify Login</button>;
};

export default Prestart;
