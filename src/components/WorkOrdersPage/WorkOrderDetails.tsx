import React from "react";

import closeIcon from "../../icons/closeIcon.svg";
import deleteIcon from "../../icons/deleteIcon.svg";

const WorkOrderDetails = () => {
  return (
    <div className="h-5/6 mx-4 mt-2 p-5 bg-white rounded-xl">
      <div className="flex flex-row">
        <h1 className="font-sans font-bold text-xl capitalize">
          First Work Order
        </h1>

        <button className="ml-auto">
          <img src={closeIcon} />
        </button>
      </div>
      <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
        <h1 className="text-blue-900 font-sans font-semibold mb-2 text-md">
          Description:
        </h1>
        <p className="text-sm text-start text-gray-500 font-sans font-light tracking-wider xl:text-xs">
          Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
          imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec
          nibh dolor. At sit commodo proin pretium senectus sed ipsum id. dolor
          sit amet consectetur. Sed convallis lorem purus imperdiet etiam. Sed
          pellentesque convallis diam sodales odio eget nec nibh dolor. At sit
          commodo proin pretium senectus sed ipsum id.
        </p>
        <div className="absolute bottom-16 right-6 mr-5 ">
          <a href="/home" className="text-blue-700">
            Go to assets
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetails;
