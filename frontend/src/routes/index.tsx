import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Layout } from '../components/layout/Layout';
import { CataloguePage } from '../pages/CataloguePage';
import { Wishlist } from '../pages/Wishlist';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { ForgotPassword } from '../pages/ForgotPassword';

import { Profile } from '../pages/Profile';
import { DeliveryDetails } from '../pages/DeliveryDetails';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/catalogue',
        element: <CataloguePage />,
      },
      {
        path: '/men',
        element: <CataloguePage />,
      },
      {
        path: '/women',
        element: <CataloguePage />,
      },
      {
        path: '/new-drops',
        element: <CataloguePage />,
      },
      {
        path: '/wishlist',
        element: <Wishlist />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/delivery-details',
        element: <DeliveryDetails />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
]);
