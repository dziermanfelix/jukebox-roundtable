import { useState } from 'react';
import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { spotifyLoginUrlPath, basePath, jukeboxPrivatePath } from '@common/paths';
import customFetch from '@common/customFetch';
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
  const navigate = useNavigate();
  const { url: loginUrl } = useLoaderData();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function cancelLogin() {
    const jukeboxName = localStorage.getItem('jukeboxName');
    await customFetch.delete(`${jukeboxPrivatePath}${jukeboxName}`);
    navigate(basePath);
  }

  function handleLogin() {
    setIsLoggingIn(true);
    window.location.href = loginUrl;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-4'>
      <div className='flex flex-col text-center space-y-1'>
        <p>You are starting a new jukebox</p>
        <p>You must log in to spotify to continue.</p>
      </div>
      <div className='flex space-x-4'>
        <button
          type='submit'
          disabled={isLoggingIn}
          onClick={handleLogin}
          className='rounded border p-2 hover:bg-gray-100'
        >
          {isLoggingIn ? 'Logging in...' : 'Spotify Login'}
        </button>
        <button onClick={() => cancelLogin()} className='rounded border p-2 hover:bg-gray-100'>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SpotifyLogin;
