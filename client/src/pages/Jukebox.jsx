import { HomeLogoLink } from '../components';
import { basePath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';

export const loader = async ({ params }) => {
  try {
    return params.id;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(basePath);
  }
};

const Jukebox = () => {
  const name = useLoaderData();
  return (
    <div>
      <h1>Jukebox {name}</h1>
      <HomeLogoLink />
    </div>
  );
};
export default Jukebox;
