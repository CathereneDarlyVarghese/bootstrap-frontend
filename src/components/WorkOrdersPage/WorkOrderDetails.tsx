import React from "react";

import closeIcon from "../../icons/closeIcon.svg";
import deleteIcon from "../../icons/deleteIcon.svg";
import { MdOutlineDone } from "react-icons/md";
import { WorkOrder } from "types";

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
  setSelectedWorkOrder: (id: string | null) => void;
}

const WorkOrderDetails: React.FC<WorkOrderDetailsProps> = ({
  workOrder,
  setSelectedWorkOrder,
}) => {
  return (
    <div className="h-5/6 mx-4 mt-2 p-5 bg-white rounded-xl">
      <div className="flex flex-row items-center">
        <h1 className="font-sans font-bold text-xl capitalize">
          {workOrder.name}
        </h1>

        <button
          className="ml-auto"
          onClick={() => {
            setSelectedWorkOrder(null);
          }}
        >
          <img src={closeIcon} />
        </button>
      </div>
      <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
        {workOrder.image && (
          <img className="h-48 w-fit mx-auto" src={workOrder.image} alt="" />
        )}
        <h1 className="text-blue-900 font-sans font-semibold mb-2 text-md">
          Description:
        </h1>
        <p className="text-sm text-start text-gray-500 font-sans font-light tracking-wider xl:text-xs">
          {workOrder.description}
        </p>
        <div className="absolute bottom-16 right-6 mr-5 flex flex-row">
          <h1 className="text-blue-700 font-sans">Mark as Done</h1>
          <input type="checkbox" className="toggle toggle-success mr-10 ml-2" />
          <a href="/home" className="text-blue-700 font-sans">
            Go to assets
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetails;
