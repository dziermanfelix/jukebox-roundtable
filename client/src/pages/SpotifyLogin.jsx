import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { spotifyLoginUrlPath, basePath, jukeboxPrivatePath } from '../../../common/paths';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import Wrapper from '../wrappers/Join';

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
  const navigate = useNavigate();
  const { url: loginUrl } = useLoaderData();

  async function cancelLogin() {
    const jukeboxName = localStorage.getItem('jukeboxName');
    await customFetch.delete(`${jukeboxPrivatePath}${jukeboxName}`);
    navigate(basePath);
  }

  return (
    <Wrapper>
      <p>You are starting a new jukebox</p>
      <p>You must log in to spotify to continue.</p>
      <button onClick={() => (window.location.href = loginUrl)}>Spotify Login</button>
      <button onClick={() => cancelLogin()}>Cancel</button>
    </Wrapper>
  );
};

export default SpotifyLogin;
