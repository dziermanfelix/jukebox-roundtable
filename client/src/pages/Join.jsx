import { Link, Form } from 'react-router-dom';
import { FormRow, HomeLogoLink, SubmitButton } from '../components';
import { startPath } from '../utils/paths';

const Join = () => {
  return (
    <div>
      <h1>Join Jukebox Roundtable</h1>
      <Form method='post'>
        <FormRow type='text' name='name' defaultValue='dust' isRequired />
        <FormRow type='text' name='code' defaultValue='dust' isRequired />
        <SubmitButton />
      </Form>
      <p>
        Start new? <Link to={startPath}>Start</Link>
      </p>
      <HomeLogoLink />
    </div>
  );
};
export default Join;
