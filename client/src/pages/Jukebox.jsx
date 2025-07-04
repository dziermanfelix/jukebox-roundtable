import { Player, Search, Queue, DropdownMenu } from '../components';
import {
  joinPath,
  getQueuePath,
  setQueuePath,
  sessionPath,
  logoutPath,
  basePath,
  jukeboxPrivatePath,
  sessionUpdateDisplayNamePath,
} from '../../../common/paths';
import { toast } from 'react-toastify';
import { useLoaderData, redirect, useNavigate } from 'react-router-dom';
import customFetch from '../../../common/customFetch';
import { useState, useContext, createContext, useEffect } from 'react';
import { Role } from '../../../utils/roles';
import { createSocketConnection } from '../utils/socket';
import { updateQueueEvent } from '../../../utils/socketEvents';

export const loader = async ({ params }) => {
  try {
    const {
      data: { jukebox },
    } = await customFetch.get(`${jukeboxPrivatePath}${params.id}`);
    const {
      data: { session },
    } = await customFetch.get(`${sessionPath}${params.id}`);
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
  const [displayName, setDisplayName] = useState(session.displayName);
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);

  const getQueue = async () => {
    try {
      const { data } = await customFetch.get(`${getQueuePath}${session._id}`);
      setQueue(data.queue);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    getQueue();

    const socket = createSocketConnection(jukebox.name, session._id);
    socket.on('connect', () => console.log('socket connected'));
    socket.on('connect_error', (err) => console.log(`socket connect error: ${err}`));
    socket.on('disconnect', () => console.log('socket disconnected'));
    socket.on('reconnect', () => {
      getQueue();
    });
    const handleQueueUpdate = (tracks) => {
      updateQueue(tracks);
    };
    socket.on(updateQueueEvent, handleQueueUpdate);
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off(updateQueueEvent, handleQueueUpdate);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        getQueue();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const reorderQueue = async (tracks) => {
    updateQueue(tracks);
  };

  const updateQueue = async (tracks) => {
    await customFetch.post(`${setQueuePath}${session._id}`, { queue: tracks });
    setQueue(tracks);
  };

  const updateDisplayName = async (newDisplayName) => {
    await customFetch.post(`${sessionUpdateDisplayNamePath}${session._id}`, {
      displayName: newDisplayName,
    });
    setDisplayName(newDisplayName);
  };

  async function logoutSession() {
    setLoggedOut(true);
    navigate(basePath);
    await customFetch.post(logoutPath, { name: name, sessionId: session._id });
  }

  return (
    <JukeboxContext.Provider
      value={{ name, session, queue, reorderQueue, updateQueue, logoutSession, displayName, updateDisplayName }}
    >
      <div className='flex p-0.5 justify-end bg-gray-500'>
        <DropdownMenu />
      </div>
      <div className='flex h-full w-full justify-center'>
        <div className='flex-col w-1/2 h-full p-2'>
          <Search />
        </div>
        <div className='flex-col w-1/2 h-full p-2 bg-gray-200'>
          <Queue />
          {session.role === Role.STARTER && <Player loggedOut={loggedOut} />}
        </div>
      </div>
    </JukeboxContext.Provider>
  );
};

export const useJukeboxContext = () => useContext(JukeboxContext);

export default Jukebox;
