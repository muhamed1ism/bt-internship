import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../main.css';
import { queryClient } from '../utils/query-client.ts';
import routeNames from './route-names.tsx';
import { Contact } from '@app/pages/Contact.tsx';
import { Home } from '@app/pages/Home.tsx';
import { Layout } from '@app/components/layout/Layout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: routeNames.root(),
        element: <Home />,
      },
      {
        path: routeNames.contact(),
        element: <Contact />,
      },
    ]
  }
]);

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
