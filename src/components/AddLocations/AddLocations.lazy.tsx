import React, { lazy, Suspense } from 'react';

const LazyAddLocations = lazy(() => import('./AddLocations'));

const AddLocations = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAddLocations {...props} />
  </Suspense>
);

export default AddLocations;
