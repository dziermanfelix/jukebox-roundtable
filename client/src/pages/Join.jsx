import { Form, useLoaderData, redirect } from 'react-router-dom';
import { FormRow, SubmitButton } from '@/components';
import { spotifyLoginPath, jukeboxPath, loginPath } from '@common/paths';
import { toast } from 'react-toastify';
import customFetch from '@common/customFetch';
import { Role } from '@utils/roles';

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
  data.name = data.name.toLowerCase();
  localStorage.setItem('jukeboxName', data.name);
  try {
    const {
      data: { role },
    } = await customFetch.post(loginPath, data);
    if (role === Role.STARTER) {
      return redirect(`${spotifyLoginPath}${data.name}`);
    } else if (role === Role.JOINER) {
      return redirect(`${jukeboxPath}${data.name}`);
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Join = () => {
  const name = useLoaderData();
  return (
    <div className='grid items-center justify-center min-h-screen'>
      <Form className='m-2 p-4 flex flex-col' method='post'>
        <h1 className='mb-6'> {name ? `join jukebox ${name}` : `Jukebox Roundtable`}</h1>
        <FormRow type='text' name='name' labelText='jukebox' defaultValue={name && name} isRequired />
        <FormRow type='password' name='code' isRequired />
        <SubmitButton display={'join'} submittingDisplay={'joining...'} />
      </Form>
    </div>
  );
};

export default Join;
