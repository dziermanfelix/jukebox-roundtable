import { Form, Link } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import { joinPath } from '../utils/paths';

const Start = () => {
  return (
    <div>
      <h1>Start Jukebox Roundtable</h1>
      <Form method='post'>
        <FormRow type='text' name='name' defaultValue='dust' isRequired />
        <FormRow type='text' name='code' defaultValue='dust' isRequired />
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
