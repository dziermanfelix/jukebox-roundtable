import { Player, Search, Queue } from '../components';
import { joinPath, getQueuePath, setQueuePath, jukeboxPath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../wrappers/Jukebox';
import { useState, useContext, createContext, useEffect } from 'react';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`${jukeboxPath}${params.id}`);
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

  const updateQueue = async (tracks) => {
    await customFetch.post(`${setQueuePath}${name}`, { username: 'specialmink', tracks: tracks });
    setQueue(tracks);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await customFetch.post(`${getQueuePath}${name}`, { username: 'specialmink' });
        setQueue(data.queue.tracks);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    fetch();
  }, []);

  return (
    <Wrapper>
      <QueueContext.Provider value={{ queue, updateQueue }}>
        <div className='search'>
          <Search />
        </div>
        <div className='queue-and-player'>
          <Queue />
          {/* <Player /> */}
        </div>
      </QueueContext.Provider>
    </Wrapper>
  );
};
export const useQueueContext = () => useContext(QueueContext);
export default Jukebox;
