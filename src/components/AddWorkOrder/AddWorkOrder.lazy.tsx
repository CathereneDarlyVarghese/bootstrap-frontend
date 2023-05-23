import React, { lazy, Suspense } from "react";

const LazyAddWorkOrder = lazy(() => import("./AddWorkOrder"));

const AddWorkOrder = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyAddWorkOrder {...props} />
  </Suspense>
);

export default AddWorkOrder;
