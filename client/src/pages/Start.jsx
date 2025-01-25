import { Form, Link, redirect, useLoaderData } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import { joinPath, jukeboxLoginPath, jukeboxCreatePath, jukeboxPath, starterSessionPath } from '../utils/paths';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { Role } from '../../../utils/roles';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
  return params.code;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const name = data.name;
  data.role = Role.STARTER;
  try {
    await customFetch.post(jukeboxCreatePath, data);
    await customFetch.post(jukeboxLoginPath, data);
    return redirect(`${jukeboxPath}${name}`);
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Start = () => {
  const spotifyCode = useLoaderData();
  return (
    <div>
      <h1>Start Jukebox Roundtable</h1>
      <Form method='post'>
        <FormRow type='text' name='name' isRequired />
        <FormRow type='password' name='code' isRequired />
        <FormRow type='hidden' name='spotifyCode' defaultValue={spotifyCode} hide />
        <SubmitButton />
      </Form>
      <p>
        Already started? <Link to={joinPath}>Join</Link>
      </p>
      <HomeLogoLink />
    </div>
  );
};

export default Start;
