import React from 'react';

const WorkOrderCard = ({
  WorkOrderName,
  WorkOrderStatus,
  WorkOrderDescription,
}) => (
  <div className="card max-h-40 overflow-y-hidden p-5 my-3 bg-slate-100 hover:border hover:border-blue-900">
    <div className="flex flex-col">
      <button
        className={`badge capitalize ${
          WorkOrderStatus === 'open'
            ? 'badge-secondary'
            : WorkOrderStatus === 'closed'
            ? 'badge-success'
            : 'badge-primary'
        }`}
      >
        {WorkOrderStatus}
      </button>
      <h1 className="text-lg font-semibold font-sans my-2">
        Test Work Order
        {WorkOrderName}
      </h1>
      <p className="font-sans font-light text-sm text-gray-500">
        {WorkOrderDescription}
      </p>
    </div>
  </div>
);

export default WorkOrderCard;
