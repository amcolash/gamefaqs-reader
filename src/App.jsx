import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Error } from './Error';
import { Games, GamesLoader } from './Games';
import { Guide } from './Guide';
import { Guides } from './Guides';
import { Root } from './Root';
import { SearchAction } from './Search';

export default () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      action: SearchAction,

      errorElement: <Error />,

      children: [
        {
          path: '/games/:query',
          element: <Games />,
          loader: GamesLoader,
        },
        {
          path: '/guides',
          element: <Guides />,
        },
        {
          path: '/guide',
          element: <Guide />,
        },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};
