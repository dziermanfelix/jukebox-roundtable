import { Player, Search, Queue, ToolsDropdown } from '../components';
import {
  joinPath,
  getQueuePath,
  setQueuePath,
  sessionPath,
  logoutPath,
  basePath,
  jukeboxPrivatePath,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await customFetch.get(`${getQueuePath}${session._id}`);
        setQueue(data.queue);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection(jukebox.name, session._id);

    socket.on('connect_error', (err) => {
      console.log(`socket connect error: ${err}`);
    });

    socket.on('connect', (data) => {
      console.log(`socket connected`);
    });

    socket.on('disconnect', (data) => {
      console.log(`socket disconnected`);
    });

    socket.on(updateQueueEvent, (tracks) => {
      updateQueue(tracks);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const reorderQueue = async (tracks) => {
    updateQueue(tracks);
  };

  const updateQueue = async (tracks) => {
    await customFetch.post(`${setQueuePath}${session._id}`, { queue: tracks });
    setQueue(tracks);
  };

  async function logoutSession() {
    // if (window.Spotify && window.Spotify.Player) {
    //   window.Spotify.Player.disconnect();
    // }
    navigate(basePath);
    await customFetch.post(logoutPath, { name: name, sessionId: session._id });
  }

  return (
    <Wrapper>
      <JukeboxContext.Provider value={{ name, session, queue, reorderQueue, updateQueue, logoutSession }}>
        <div className='tool-bar'>
          <ToolsDropdown />
        </div>
        <div className='jukebox'>
          <div className='left-panel'>
            <Search />
          </div>
          <div className='right-panel'>
            <Queue />
            {session.role === Role.STARTER && <Player />}
          </div>
        </div>
      </JukeboxContext.Provider>
    </Wrapper>
  );
};

export const useJukeboxContext = () => useContext(JukeboxContext);

export default Jukebox;
