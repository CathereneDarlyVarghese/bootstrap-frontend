import React, { lazy, Suspense } from 'react';

const LazyListPage = lazy(() => import('./ListPage'));

const ListPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyListPage {...props} />
  </Suspense>
);

export default ListPage;
