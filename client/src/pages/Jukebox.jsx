import { HomeLogoLink, Player } from '../components';
import { joinPath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { jukeboxPath } from '../utils/paths';
import Search from '../components/Search';
import Queue from '../components/Queue';
import Wrapper from '../wrappers/Jukebox';
import { useState, useContext, createContext } from 'react';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`${jukeboxPath}${params.id}`, { data: { name: params.id } });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(`${joinPath}${params.id}`);
  }
};

const QueueContext = createContext();
const Jukebox = () => {
  const { jukebox } = useLoaderData();
  const { name } = jukebox;

  const [queue, setQueue] = useState([]);
  const updateQueue = (newItem) => {
    setQueue([...queue, newItem]);
  };

  return (
    <Wrapper>
      <QueueContext.Provider value={{ queue, updateQueue }}>
        <div className='data'>
          <Search />
          <div className='queue'>
            <Queue />
            <Player />
          </div>
        </div>
      </QueueContext.Provider>
    </Wrapper>
  );
};
export const useQueueContext = () => useContext(QueueContext);
export default Jukebox;
