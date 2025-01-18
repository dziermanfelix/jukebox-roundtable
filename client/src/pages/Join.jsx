import { Link, Form, useLoaderData, redirect } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import { prestartPath, jukeboxLoginPath, jukeboxPath, joinerSessionPath } from '../utils/paths';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
  try {
    if (!params.id) {
      return null;
    }
    return params.id;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(basePath);
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const name = data.name;
  try {
    await customFetch.post(jukeboxLoginPath, data);
    await customFetch.post(joinerSessionPath, data);
    return redirect(`${jukeboxPath}${name}`);
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Join = () => {
  const name = useLoaderData();
  return (
    <div>
      <h1>Join Jukebox Roundtable</h1>
      <Form method='post'>
        <FormRow type='text' name='name' defaultValue={name && name} isRequired />
        <FormRow type='password' name='code' isRequired />
        <SubmitButton />
      </Form>
      <p>
        Start new? <Link to={prestartPath}>Start</Link>
      </p>
      <HomeLogoLink />
    </div>
  );
};

export default Join;
