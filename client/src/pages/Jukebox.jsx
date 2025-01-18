import { Player, Search, Queue, DebouncingText } from '../components';
import { joinPath, getQueuePath, setQueuePath, jukeboxPath, sessionPath } from '../utils/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../wrappers/Jukebox';
import { useState, useContext, createContext, useEffect } from 'react';
import socket from '../utils/socket';

export const loader = async ({ params }) => {
  try {
    const {
      data: { jukebox },
    } = await customFetch.get(`${jukeboxPath}${params.id}`);
    const {
      data: { session },
    } = await customFetch.get(`${sessionPath}`);
    return { jukebox: jukebox, session: session };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect(`${joinPath}${params.id}`);
  }
};

const JukeboxContext = createContext();

const Jukebox = () => {
  const { jukebox, session } = useLoaderData();
  const { name } = jukebox;
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await customFetch.post(`${getQueuePath}${name}`, { sessionId: session._id });
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
      console.log(`socket connect error: ${err}`);
    });
    socket.on('connect', (data) => {});
    socket.on('disconnect', (data) => {});
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const reorderQueue = async (tracks) => {
    updateQueue(session._id, tracks);
  };

  const updateQueue = async (sessionId, tracks) => {
    await customFetch.post(`${setQueuePath}${name}`, { sessionId: sessionId, tracks: tracks });
    setQueue(tracks);
  };

  const displayNameUpdate = async (displayName) => {
    session.displayName = displayName;
    try {
      await customFetch.patch(sessionPath, session);
      return;
    } catch (error) {
      toast.error(error.response.data.msg);
      return error;
    }
  };

  return (
    <Wrapper>
      <JukeboxContext.Provider value={{ name, session, queue, reorderQueue, updateQueue, socket }}>
        <div className='search'>
          <Search />
        </div>
        <div className='queue-and-player'>
          <DebouncingText initialValue={session.displayName} updater={displayNameUpdate} />
          <Queue />
          <Player />
        </div>
      </JukeboxContext.Provider>
    </Wrapper>
  );
};

export const useJukeboxContext = () => useContext(JukeboxContext);

export default Jukebox;
