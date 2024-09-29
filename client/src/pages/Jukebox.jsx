import { HomeLogoLink } from '../components';
import { joinPath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { jukeboxPath } from '../utils/paths';
import Search from '../components/Search';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`${jukeboxPath}${params.id}`, { data: { name: params.id } });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(`${joinPath}${params.id}`);
  }
};

const Jukebox = () => {
  const { jukebox } = useLoaderData();
  const { name } = jukebox;
  return (
    <div>
      <h1>Jukebox {name}</h1>
      <div>
        <Search />
      </div>
      <div>
        <HomeLogoLink />
      </div>
    </div>
  );
};
export default Jukebox;
