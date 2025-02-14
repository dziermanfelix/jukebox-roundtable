import { Form, useLoaderData, redirect } from 'react-router-dom';
import { FormRow, SubmitButton } from '../components';
import { spotifyLoginPath, jukeboxPath, loginPath } from '../../../common/paths';
import { toast } from 'react-toastify';
import customFetch from '../../../common/customFetch';
import { Role } from '../../../utils/roles';
import Wrapper from '../wrappers/Join';

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
  localStorage.setItem('jukeboxName', name);
  try {
    const {
      data: { role },
    } = await customFetch.post(loginPath, data);
    if (role === Role.STARTER) {
      return redirect(`${spotifyLoginPath}${name}`);
    } else if (role === Role.JOINER) {
      return redirect(`${jukeboxPath}${name}`);
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Join = () => {
  const name = useLoaderData();
  return (
    <Wrapper>
      {name ? <h1>join jukebox {name}</h1> : <h1>Jukebox Roundtable</h1>}
      <Form className='form' method='post'>
        <FormRow type='text' name='name' labelText='jukebox' defaultValue={name && name} isRequired />
        <FormRow type='password' name='code' isRequired />
        <SubmitButton display={'login'} submittingDisplay={'logging in...'} />
      </Form>
    </Wrapper>
  );
};

export default Join;
