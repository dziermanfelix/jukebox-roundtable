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
import Wrapper from '../wrappers/Jukebox';
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
    console.log('get queue called');
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
    socket.on('connect_error', (err) => console.log(`Socket connect error: ${err}`));
    socket.on('disconnect', () => console.log('socket disconnected'));
    socket.on('reconnect', () => {
      console.log('reconnect called');
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
    <Wrapper>
      <JukeboxContext.Provider
        value={{ name, session, queue, reorderQueue, updateQueue, logoutSession, displayName, updateDisplayName }}
      >
        <div className='tool-bar'>
          <p className='left-tool'> Jukebox {name} </p>
          <div className='right-tool'>
            <p> hello, {displayName} </p>
          </div>
          <div className='fixed-tool'>
            <DropdownMenu />
          </div>
        </div>
        <div className='jukebox'>
          <div className='left-panel'>
            <Search />
          </div>
          <div className='right-panel'>
            <Queue />
            {session.role === Role.STARTER && <Player loggedOut={loggedOut} />}
          </div>
        </div>
      </JukeboxContext.Provider>
    </Wrapper>
  );
};

export const useJukeboxContext = () => useContext(JukeboxContext);

export default Jukebox;
