import React from 'react';

import { WorkOrder } from 'types';
import closeIcon from '../../icons/closeIcon.svg';

// sample image for ui testing
import testImage from '../LandingPage/testImage.png';

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
  setSelectedWorkOrder: (id: string | null) => void;
  closeAsset: () => void;
}

const WorkOrderDetails: React.FC<WorkOrderDetailsProps> = ({
  // workOrder,
  // setSelectedWorkOrder,
  closeAsset,
}) => (
  <div className="h-5/6 mx-4 mt-2 p-5 bg-white rounded-xl overflow-y-auto flex flex-col">
    <div className="flex flex-row items-center">
      <h1 className="font-sans font-bold text-xl capitalize">
        First Work Order
        {/* {workOrder.name} */}
      </h1>

      <button
        className="ml-auto"
        // onClick={() => {
        //   setSelectedWorkOrder(null);
        // }}
      >
        <img alt="close icon" src={closeIcon} onClick={closeAsset} />
      </button>
    </div>
    <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
      {/* {workOrder.image && (
          <img className="h-48 w-fit mx-auto" src={workOrder.image} alt="" />
        )} */}
      <img className="h-48 w-fit mx-auto" src={testImage} alt="" />
      <h1 className="text-blue-900 font-sans font-semibold mb-2 text-md">
        Description:
      </h1>
      <p className="text-sm text-start text-gray-500 font-sans font-light tracking-wider xl:text-xs">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
        ultrices congue orci at fringilla. Quisque pharetra magna quis ante
        {/* {workOrder.description} */}
      </p>
    </div>
    <div className="mr-5 flex flex-row md:flex-col mt-auto items-center justify-center">
      <div className="flex flex-row gap-1 mx-auto my-5">
        <h1 className="text-blue-700 font-sans font-semibold">Mark as Done</h1>
        <input type="checkbox" className="toggle toggle-success mr-10 ml-2" />
      </div>
      <div className="flex flex-row mx-auto">
        <a href="/home" className="text-blue-700 font-sans font-semibold">
          Go to assets
        </a>
      </div>
    </div>
  </div>
);

export default WorkOrderDetails;
