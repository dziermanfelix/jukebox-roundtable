import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Jukebox, Landing, Start, Error, Join, HomeLayout } from './pages';
import { action as startAction } from './pages/Start';
import { loader as jukeboxLoader } from './pages/jukebox';
import { loader as joinLoader, action as joinAction } from './pages/Join';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: '/start',
        element: <Start />,
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
