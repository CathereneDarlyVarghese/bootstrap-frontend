import React, { lazy, Suspense } from 'react';

const LazyAddDocuments = lazy(() => import('./AddDocuments'));

const AddDocuments = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAddDocuments {...props} />
  </Suspense>
);

export default AddDocuments;
