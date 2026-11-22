import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Loader } from '../shared/ui/Loader';

const HubPage = lazy(() => import('./hub/HubPage'));
const SolarSystemExperience = lazy(() => import('../experiences/solar-system'));
const BodiesExperience = lazy(() => import('../experiences/bodies'));
const BlackHoleExperience = lazy(() => import('../experiences/black-hole'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader message="Loading Hub..." />}>
            <HubPage />
          </Suspense>
        ),
      },
      {
        path: 'solar-system',
        element: (
          <Suspense fallback={<Loader message="Building Solar System..." />}>
            <SolarSystemExperience />
          </Suspense>
        ),
      },
      {
        path: 'bodies',
        element: (
          <Suspense fallback={<Loader message="Loading Planetary Inspector..." />}>
            <BodiesExperience />
          </Suspense>
        ),
      },
      {
        path: 'black-hole',
        element: (
          <Suspense fallback={<Loader message="Simulating Relativistic Geodesics..." />}>
            <BlackHoleExperience />
          </Suspense>
        ),
      },
    ],
  },
]);
