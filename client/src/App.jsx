import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Jukebox, Landing, Prestart, Start, Error, Join, HomeLayout, Callback } from './pages';
import { loader as prestartLoader } from './pages/Prestart';
import { loader as jukeboxLoader } from './pages/Jukebox';
import { loader as joinLoader, action as joinAction } from './pages/Join';
import { loader as callbackLoader } from './pages/Callback';
import { loader as startLoader, action as startAction } from './pages/Start';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: '/prestart',
        element: <Prestart />,
        loader: prestartLoader,
      },
      {
        path: '/callback',
        element: <Callback />,
        loader: callbackLoader,
      },
      {
        path: '/start',
        element: <Start />,
        loader: startLoader,
        action: startAction,
      },
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
