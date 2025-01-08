import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Jukebox, Landing, Start, Error, Join, HomeLayout, Callback, StartAuthenticated } from './pages';
import { loader as startLoader, action as startAction } from './pages/Start';
import { loader as jukeboxLoader } from './pages/Jukebox';
import { loader as joinLoader, action as joinAction } from './pages/Join';
import { loader as callbackLoader } from './pages/Callback';
import { loader as startAuthenticatedLoader, action as startAuthenticatedAction } from './pages/StartAuthenticated';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: '/join',
        element: <Join />,
        loader: joinLoader,
        action: joinAction,
      },
      {
        path: '/join/:id',
        element: <Join />,
        loader: joinLoader,
        action: joinAction,
      },
      {
        path: '/start',
        element: <Start />,
        loader: startLoader,
        action: startAction,
      },
      {
        path: '/callback',
        element: <Callback />,
        loader: callbackLoader,
      },
      {
        path: '/start/authenticated',
        element: <StartAuthenticated />,
        loader: startAuthenticatedLoader,
        action: startAuthenticatedAction,
      },
      {
        path: '/jukebox/:id',
        element: <Jukebox />,
        loader: jukeboxLoader,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
