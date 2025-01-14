import { Player, Search, Queue } from '../components';
import { joinPath, getQueuePath, setQueuePath, jukeboxPath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../wrappers/Jukebox';
import { useState, useContext, createContext, useEffect } from 'react';
import socket from '../utils/socket';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`${jukeboxPath}${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(`${joinPath}${params.id}`);
  }
};

const JukeboxContext = createContext();

const Jukebox = () => {
  const { jukebox } = useLoaderData();
  const { name } = jukebox;
  const [queue, setQueue] = useState([]);

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

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.log(`connect error: ${err}`);
    });
    socket.on('connect', (data) => {
      console.log('socket connected');
    });
    socket.on('disconnect', (data) => {
      console.log('socket disconnected');
    });
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateQueue = async (tracks) => {
    await customFetch.post(`${setQueuePath}${name}`, { username: 'specialmink', tracks: tracks });
    setQueue(tracks);
  };

  return (
    <Wrapper>
      <JukeboxContext.Provider value={{ name, queue, updateQueue, socket }}>
        <div className='search'>
          <Search />
        </div>
        <div className='queue-and-player'>
          <Queue />
          <Player />
        </div>
      </JukeboxContext.Provider>
    </Wrapper>
  );
};

export const useJukeboxContext = () => useContext(JukeboxContext);

export default Jukebox;
