import { Form, Link, redirect, useLoaderData } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import {
  joinPath,
  jukeboxLoginPath,
  jukeboxCreatePath,
  jukeboxPath,
  spotifyLoginUrlPath,
  basePath,
} from '../utils/paths';
import customFetch from '../utils/customFetch';
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

export const action = async ({ request }) => {
  // const formData = await request.formData();
  // const data = Object.fromEntries(formData);
  // const name = data.name;
  // try {
  //   await customFetch.post(createPath, data);
  //   await customFetch.post(loginPath, data);
  //   return redirect(`${jukeboxPath}${name}`);
  // } catch (error) {
  //   toast.error(error?.response?.data?.msg);
  //   return error;
  // }
};

const Start = () => {
  const { url: loginUrl } = useLoaderData();
  return <button onClick={() => (window.location.href = loginUrl)}>Spotify Login</button>;
};

export default Start;
