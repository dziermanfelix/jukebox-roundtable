import { Form, Link, redirect } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import { joinPath, loginPath, createPath, jukeboxPath } from '../utils/paths';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const name = data.name;
  try {
    await customFetch.post(createPath, data);
    await customFetch.post(loginPath, data);
    return redirect(`${jukeboxPath}${name}`);
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Start = () => {
  return (
    <div>
      <h1>Start Jukebox Roundtable</h1>
      <Form method='post'>
        <FormRow type='text' name='name' isRequired />
        <FormRow type='text' name='code' isRequired />
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
