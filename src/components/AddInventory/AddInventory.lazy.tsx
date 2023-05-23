import React, { lazy, Suspense } from 'react';

const LazyAddInventory = lazy(() => import('./AddInventory'));

const AddInventory = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAddInventory {...props} />
  </Suspense>
);

export default AddInventory;
