import React from "react";

import image6 from "./Images/image6.jpeg";

const PendingOrders = () => {
  return (
    //name, image, description, status, type
    <div
      className="card border border-blue-900 shadow-xl w-full my-5"
      style={{ height: "100%" }}
    >
      <div className="card-body flex flex-row">
        <div className="w-9/12">
          <div className="card-title">
            <h1>Appliance Name</h1>

            <div className="badge text-md">Pending</div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Type:</h3>
            <h3 className="text-lg font-bold">Description:</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
              imperdiet etiam. Sed pellentesque convallis diam sodales odio eget
              nec nibh dolor. Lorem ipsum dolor sit amet consectetur. Sed
            </p>
          </div>
        </div>
        <div className="w-3/12">
          <figure>
            <img src={image6} alt="an image" className="rounded-xl h-full" />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
