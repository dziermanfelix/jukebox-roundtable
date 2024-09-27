import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Jukebox, Landing, Start, Error, Join, HomeLayout } from './pages';

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
      },
      {
        path: '/join',
        element: <Join />,
      },
      {
        path: '/jukebox/:id',
        element: <Jukebox />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
